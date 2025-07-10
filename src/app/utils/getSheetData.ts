import { google } from "googleapis";
import { transformDataToObjects } from "./transformDataToObjects";
import { TTLCache } from "./TTLCache";
import { SheetEntry, SheetDataResponse } from "./types";

const sheetCache = new TTLCache<SheetEntry[]>(1000 * 60 * 15); // 15 minutes

export async function getSheetData(): Promise<SheetDataResponse> {
  const cacheKey = "sheetData";

  const cachedData = sheetCache.get(cacheKey);
  if (cachedData) {
    console.log("Returning cached sheet data");
    return { data: cachedData };
  } else {
    console.log("Cache miss: Fetching new data");
  }

  try {
    const auth = await google.auth.getClient({
      projectId: process.env.GOOGLE_SHEETS_PROJECT_ID,
      credentials: {
        type: "service_account",
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "MainSheet!A:AL",
    });

    const rawValues = result.data.values as string[][]; 

    const transformed = transformDataToObjects<SheetEntry>(rawValues);

    sheetCache.set(cacheKey, transformed);
    console.log("New sheet data cached");

    return { data: transformed };
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw new Error("Failed to load sheet data");
  }
}
