import { NextResponse } from "next/server";
import { getSheetData } from "../../utils/getSheetData";
import { SheetEntry } from "../../utils/types";

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === "development";

// Dynamic CORS configuration for multi-environments
const allowedOrigins = isDev
  ? ["http://localhost:3000", "https://localhost:3000"]
  : [
      "https://incredibleplaygroupfinder.ca",
      "https://ipf-web.vercel.app",
      "https://parent-resource.vercel.app",
    ];

function getCorsHeaders(origin: string | null) {
  const isAllowedOrigin = allowedOrigins.includes(origin || "");

  // Warn about blocked CORS origin (in dev only)
  if (!isAllowedOrigin && isDev) {
    console.warn("⚠️ Blocked CORS request from:", origin);
  }

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin! : "null",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    const { data: sheetData } = await getSheetData();

    // Step 1: Keep rows with valid lat/lng
    const markersWithLatLng = sheetData.filter((entry: SheetEntry) => {
      const lat = parseFloat(entry.lat || "");
      const lng = parseFloat(entry.lng || "");
      return !isNaN(lat) && !isNaN(lng);
    });

    // Step 2: Deduplicate by address
    const addresses = new Set<string>();
    const uniqueMarkers = markersWithLatLng.filter((entry: SheetEntry) => {
      if (addresses.has(entry.Address || "")) return false;
      addresses.add(entry.Address || "");
      return true;
    });

    return NextResponse.json({ markers: uniqueMarkers });
  } catch (err) {
    console.error("Error generating markers:", err);
    return NextResponse.json(
      { error: "Failed to get markers" },
      { status: 500 }
    );
  }
}
