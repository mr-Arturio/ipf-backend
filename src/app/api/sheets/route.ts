// src/app/api/sheets/route.ts

import { google } from "googleapis";
import { NextResponse } from "next/server";
import { transformDataToObjects } from "../../utils/transformDataToObjects";
import { TTLCache } from "../../../app/utils/TTLCache";

const sheetCache = new TTLCache<any[]>(1000 * 60 * 15); // 15 minutes

export async function GET() {
  const cacheKey = "sheetData";

  // Try to get cached data
  const cachedData = sheetCache.get(cacheKey);
  if (cachedData) {
    console.log("Returning cached sheet data");
    return NextResponse.json({ data: cachedData });
  } else {
    console.log("Cache miss: Fetching new data");
  }

  try {
    const auth = await google.auth.getClient({
      projectId: process.env.GOOGLE_SHEETS_PROJECT_ID,
      credentials: {
        type: "service_account",
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "MainSheet!A:AL",
    });

    const transformed = transformDataToObjects<any>(result.data.values || []);

    // Cache the result
    sheetCache.set(cacheKey, transformed);
    console.log("New sheet data cached");

    return NextResponse.json({ data: transformed });
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return NextResponse.json(
      { error: "Failed to load sheet data" },
      { status: 500 }
    );
  }
}
