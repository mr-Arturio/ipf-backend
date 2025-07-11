import { SheetEntry } from "./types";

// Translation mappings for French to English
const translationMappings: Record<string, Record<string, string>> = {
  fr: {
    // Add French translations here if needed
  },
};

// Age mapping for hierarchical filters
const ageMapping: Record<string, string[]> = {
  "Baby (0-24m)": [
    "Baby (0-24m)",
    "Baby (0-18m)",
    "Baby (0-12m)",
    "Baby (non-walking)",
  ],
  "Baby (0-18m)": ["Baby (0-18m)", "Baby (0-12m)", "Baby (non-walking)"],
  "Child (0-6y)": [
    "Child (0-6y)",
    "Child (3-6y)",
    "Baby (0-24m)",
    "Baby (0-18m)",
    "Baby (0-12m)",
    "Baby (non-walking)",
  ],
};

// Language mapping logic
const languageMapping: Record<string, string[]> = {
  English: ["English", "EN/FR"],
  French: ["French", "EN/FR"],
};

// Helper function to safely get string value from SheetEntry
const getStringValue = (value: string | number | undefined): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return "";
};

export function applyFilters(
  data: SheetEntry[],
  filterCriteria: {
    date?: string;
    area?: string;
    language?: string;
    day?: string;
    organizer?: string;
    age?: string;
    time?: string;
    address?: string;
  },
  translation?: string
): SheetEntry[] {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day in local time

    // Function to translate filter criteria from French to English
    const translateCriteria = (value: string): string => {
      if (
        translation === "fr" &&
        translationMappings.fr &&
        translationMappings.fr[value]
      ) {
        return translationMappings.fr[value];
      }
      return value;
    };

    const translatedCriteria = {
      area: translateCriteria(filterCriteria.area || ""),
      language: translateCriteria(filterCriteria.language || ""),
      day: translateCriteria(filterCriteria.day || ""),
      organizer: filterCriteria.organizer || "",
      age: translateCriteria(filterCriteria.age || ""),
      time: translateCriteria(filterCriteria.time || ""),
      date: filterCriteria.date || "",
      address: filterCriteria.address || "",
    };

    const parseDate = (dateString: string) => {
      if (!dateString) return null;
      const date = new Date(dateString.trim() + "T00:00:00"); // Ensure time part is set
      if (isNaN(date.getTime())) {
        console.error(`Invalid date string: "${dateString}"`);
        return null;
      }
      date.setHours(0, 0, 0, 0); // Normalize to start of the day
      return date;
    };

    const categorizeTime = (timeString: string) => {
      if (!timeString || !timeString.includes(" - ")) {
        return { startTime: null, timeCategory: "No Time Specified" };
      }
      const [startTimeString] = timeString.split(" - ");
      const [hours, minutes] = startTimeString.split(":").map(Number);
      const startTime = (hours || 0) * 100 + (minutes || 0);
      let timeCategory;
      if (startTime < 1200) {
        timeCategory = "Morning";
      } else if (startTime >= 1200 && startTime < 1600) {
        timeCategory = "Afternoon";
      } else {
        timeCategory = "Evening";
      }
      return { startTime, timeCategory };
    };

    return data
      .filter((item) => {
        // Address filter
        const itemAddress = getStringValue(item.Address);
        if (
          translatedCriteria.address &&
          itemAddress !== translatedCriteria.address
        ) {
          return false;
        }

        // Date filtering - exclude past events
        const itemEventDate = getStringValue(item.eventDate);
        const itemDate = parseDate(itemEventDate);
        let isUpcomingEvent = false;
        if (itemDate) {
          isUpcomingEvent = itemDate >= today;
        } else if (!itemEventDate && !getStringValue(item.Day)) {
          isUpcomingEvent = true;
        }

        if (!isUpcomingEvent) return false;

        // Area filter
        const itemArea = getStringValue(item.Area);
        if (translatedCriteria.area && itemArea !== translatedCriteria.area) {
          return false;
        }

        // Language filter with mapping
        const itemLanguage = getStringValue(item.Language);
        const validLanguages = languageMapping[translatedCriteria.language] || [
          translatedCriteria.language,
        ];
        if (
          translatedCriteria.language &&
          !validLanguages.includes(itemLanguage)
        ) {
          return false;
        }

        // Day filter
        const itemDay = getStringValue(item.Day);
        if (translatedCriteria.day && itemDay !== translatedCriteria.day) {
          return false;
        }

        // Organizer filter
        const itemOrganizer = getStringValue(item.Organizer);
        if (
          translatedCriteria.organizer &&
          itemOrganizer !== translatedCriteria.organizer
        ) {
          return false;
        }

        // Age filter with mapping
        const itemAge = getStringValue(item.Age);
        const validAges = ageMapping[translatedCriteria.age] || [
          translatedCriteria.age,
        ];
        if (translatedCriteria.age && !validAges.includes(itemAge)) {
          return false;
        }

        // Time filter
        const itemTime = getStringValue(item.Time);
        const { timeCategory } = categorizeTime(itemTime);
        if (
          translatedCriteria.time &&
          timeCategory !== translatedCriteria.time
        ) {
          return false;
        }

        // Specific date filter
        if (
          translatedCriteria.date &&
          itemEventDate !== translatedCriteria.date
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const { startTime: timeA } = categorizeTime(getStringValue(a.Time));
        const { startTime: timeB } = categorizeTime(getStringValue(b.Time));

        const isPausedA = getStringValue(a.Paused) === "yes";
        const isPausedB = getStringValue(b.Paused) === "yes";

        // If one is paused and the other is not, move paused one to the bottom
        if (isPausedA && !isPausedB) return 1;
        if (!isPausedA && isPausedB) return -1;

        if (timeA === null) return 1;
        if (timeB === null) return -1;
        return timeA - timeB;
      });
  } catch (error) {
    console.error("Error applying filters:", error);
    return [];
  }
}
