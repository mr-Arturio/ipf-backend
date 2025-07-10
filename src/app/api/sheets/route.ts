import { NextResponse } from "next/server";
import { getSheetData } from "../../utils/getSheetData";

// Dynamic CORS configuration for multi-environments
const allowedOrigins = [
  "http://localhost:3000",
  "https://incredibleplaygroupfinder.ca",
  "https://ipf-web.vercel.app",
  "https://parent-resource.vercel.app",
];

function getCorsHeaders(origin: string | null) {
  const isAllowedOrigin = allowedOrigins.includes(origin || "");

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
    const origin = request.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    const result = await getSheetData();

    return NextResponse.json(
      {
        data: result.data,
        meta: {
          count: result.data.length,
          sample: result.data[0],
        },
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return NextResponse.json(
      { error: "Failed to load sheet data" },
      { status: 500 }
    );
  }
}
