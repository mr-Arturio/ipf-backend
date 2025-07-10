import { NextResponse } from "next/server";
import { getSheetData } from "../../utils/getSheetData";

export async function GET() {
  try {
    const { data: sheetData } = await getSheetData();

    // Step 1: Keep rows with valid lat/lng
    const markersWithLatLng = sheetData.filter((entry: any) => {
      const lat = parseFloat(entry.lat);
      const lng = parseFloat(entry.lng);
      return !isNaN(lat) && !isNaN(lng);
    });

    // Step 2: Deduplicate by address
    const addresses = new Set<string>();
    const uniqueMarkers = markersWithLatLng.filter((entry: any) => {
      if (addresses.has(entry.Address)) return false;
      addresses.add(entry.Address);
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
