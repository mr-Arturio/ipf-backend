import { NextResponse } from "next/server";
import { getSheetData } from "../../utils/getSheetData";

export async function GET() {
  try {
    const result = await getSheetData();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return NextResponse.json(
      { error: "Failed to load sheet data" },
      { status: 500 }
    );
  }
}
