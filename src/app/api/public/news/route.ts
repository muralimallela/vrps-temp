import { NextResponse } from "next/server";
import NewsItem from "@/src/models/NewsItem";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "All";

    const filter: Record<string, any> = {};
    if (category && category !== "All") {
      filter.category = category;
    }

    const items = await NewsItem.find(filter, { sort: { createdAt: -1 } });
    
    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    console.error("Error in GET /api/public/news:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch news" },
      { status: 500 }
    );
  }
}
