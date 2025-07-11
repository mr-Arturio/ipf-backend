import { SheetEntry } from "./types";

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
  }
): SheetEntry[] {
  return data.filter((entry) => {
    // Date filter
    if (filterCriteria.date && entry.eventDate !== filterCriteria.date) {
      return false;
    }

    // Area filter
    if (filterCriteria.area && entry.Area !== filterCriteria.area) {
      return false;
    }

    // Language filter
    if (filterCriteria.language && entry.Language !== filterCriteria.language) {
      return false;
    }

    // Day filter
    if (filterCriteria.day && entry.Day !== filterCriteria.day) {
      return false;
    }

    // Organizer filter
    if (filterCriteria.organizer && entry.Organizer !== filterCriteria.organizer) {
      return false;
    }

    // Age filter
    if (filterCriteria.age && entry.Age !== filterCriteria.age) {
      return false;
    }

    // Time filter
    if (filterCriteria.time && entry.Time !== filterCriteria.time) {
      return false;
    }

    // Address filter
    if (filterCriteria.address && entry.Address !== filterCriteria.address) {
      return false;
    }

    return true;
  });
} 