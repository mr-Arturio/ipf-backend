import { NextRequest, NextResponse } from "next/server";
import { getSheetData } from "@/app/utils/getSheetData";
import { applyFilters } from "@/app/utils/applyFilters";
import { getCorsHeaders } from "@/app/utils/cors";

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("🔧 /api/filtered-sheets called");
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    const { filters, translation } = await req.json();
    console.log("📋 Received filters:", filters);
    console.log("🌐 Translation:", translation);

    const { data } = await getSheetData();
    console.log("📊 Raw data count:", data.length);

    const filtered = applyFilters(data, filters, translation);
    console.log("✅ Filtered data count:", filtered.length);

    return NextResponse.json(
      {
        data: filtered,
        meta: {
          count: filtered.length,
          sample: filtered[0],
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("❌ Error in filtered-sheets route:", error);
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    return NextResponse.json(
      {
        error: "Failed to process filtered sheets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
