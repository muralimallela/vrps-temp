import { NextResponse } from "next/server";
import GalleryItem from "@/src/models/GalleryItem";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const filter: Record<string, any> = {};
    if (category && category !== "All") {
      filter.category = category;
    }
    if (featuredOnly) {
      filter.featured = true;
    }

    const items = await GalleryItem.find(filter, {
      sort: { createdAt: -1 },
      limit: limit || 100,
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    console.error("Error in GET /api/public/gallery:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery items", data: [] },
      { status: 500 }
    );
  }
}
