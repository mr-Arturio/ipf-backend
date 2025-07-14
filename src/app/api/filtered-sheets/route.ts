import { NextRequest, NextResponse } from "next/server";
import { getSheetData } from "@/app/utils/getSheetData";
import { applyFilters } from "@/app/utils/applyFilters";
import { getCorsHeaders } from "@/app/utils/cors";

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(filters: any, translation: any): string {
  return JSON.stringify({ filters, translation });
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

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

    // Check cache first
    const cacheKey = getCacheKey(filters, translation);
    const cached = cache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      console.log("⚡ Returning cached result");
      return NextResponse.json(
        {
          data: cached.data,
          meta: {
            count: cached.data.length,
            sample: cached.data[0],
            cached: true,
          },
        },
        { headers: corsHeaders }
      );
    }

    const { data } = await getSheetData();
    console.log("📊 Raw data count:", data.length);

    const filtered = applyFilters(data, filters, translation);
    console.log("✅ Filtered data count:", filtered.length);

    // Cache the result
    cache.set(cacheKey, {
      data: filtered,
      timestamp: Date.now(),
    });

    return NextResponse.json(
      {
        data: filtered,
        meta: {
          count: filtered.length,
          sample: filtered[0],
          cached: false,
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
