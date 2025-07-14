import { NextResponse } from "next/server";
import { getSheetData } from "@/app/utils/getSheetData";
import { applyFilters } from "@/app/utils/applyFilters";
import { getCorsHeaders } from "@/app/utils/cors";

// Type for processed markers with lat/lng as numbers
interface ProcessedMarker {
  [key: string]: string | number | undefined;
  lat: number;
  lng: number;
  Address?: string;
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

    // Apply filters including date filtering
    const filteredData = applyFilters(sheetData, filterParams, translation);

    console.log(
      `🎯 Markers API: Filtered ${sheetData.length} -> ${filteredData.length} items`
    );
    console.log(`📅 Date filter: ${filterParams.date}`);

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

    console.log(
      `🗺️ Markers API: Returning ${markers.length} markers from ${filteredData.length} filtered items`
    );
    return NextResponse.json({ markers }, { headers: corsHeaders });
  } catch (err) {
    console.error("Error generating markers:", err);
    return NextResponse.json(
      { error: "Failed to get markers" },
      { status: 500 }
    );
  }
}
