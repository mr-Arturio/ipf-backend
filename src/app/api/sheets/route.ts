import { NextResponse } from "next/server";
import { getSheetData } from "../../utils/getSheetData";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET() {
  try {
    const result = await getSheetData();

    console.log("✅ Sheet data fetched:", {
      totalRows: result.data.length,
      firstRow: result.data[0],
    });

    return NextResponse.json(
      {
        data: result.data,
        meta: {
          count: result.data.length,
          sample: result.data[0],
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error fetching sheet data:", error);
    return NextResponse.json(
      { error: "Failed to load sheet data" },
      { status: 500 }
    );
  }
}
