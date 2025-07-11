import { NextResponse } from "next/server";
import { getSheetData } from "../../utils/getSheetData";
import { applyFilters } from "../../utils/applyFilters";

// Type for processed markers with lat/lng as numbers
interface ProcessedMarker {
  [key: string]: string | number | undefined;
  lat: number;
  lng: number;
  Address?: string;
}

const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://incredibleplaygroupfinder.ca",
  "https://ipf-web.vercel.app",
  "https://parent-resource.vercel.app",
];

function getCorsHeaders(origin: string | null) {
  const isAllowedOrigin = allowedOrigins.includes(origin || "");

  if (!isAllowedOrigin && process.env.NODE_ENV === "development") {
    console.warn("\u26A0\uFE0F Blocked CORS request from:", origin);
  }

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin
      ? origin || allowedOrigins[0]
      : allowedOrigins[0],
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const filterParams = {
      date: searchParams.get("date") || "",
      area: searchParams.get("area") || "",
      language: searchParams.get("language") || "",
      day: searchParams.get("day") || "",
      organizer: searchParams.get("organizer") || "",
      age: searchParams.get("age") || "",
      time: searchParams.get("time") || "",
      address: searchParams.get("address") || "",
    };
    const translation = searchParams.get("translation") || "en";

    const { data: sheetData } = await getSheetData();

    // Always apply filters to exclude past events, even if no other filters are provided
    const filteredData = applyFilters(sheetData, filterParams, translation);

    // Process markers: filter valid lat/lng and deduplicate by address
    const markers: ProcessedMarker[] = [];

    for (const entry of filteredData) {
      const lat = parseFloat(entry.lat || "");
      const lng = parseFloat(entry.lng || "");
      const address = entry.Address?.trim();

      if (
        !isNaN(lat) &&
        !isNaN(lng) &&
        address &&
        !markers.some((m) => m.Address === address)
      ) {
        markers.push({ ...entry, lat, lng });
      }
    }

    return NextResponse.json({ markers }, { headers: corsHeaders });
  } catch (err) {
    console.error("Error generating markers:", err);
    return NextResponse.json(
      { error: "Failed to get markers" },
      { status: 500 }
    );
  }
}
