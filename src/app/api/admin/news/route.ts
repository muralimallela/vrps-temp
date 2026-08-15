import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import NewsItem from "@/src/models/NewsItem";
import { getAppwriteStorage, STORAGE_BUCKETS } from "@/src/lib/appwrite";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function GET() {
  try {
    await requireAdmin();
    const items = await NewsItem.find({}, { sort: { createdAt: -1 } });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Unauthorized" },
      { status: error.message === "Forbidden" ? 403 : 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const category = (formData.get("category") as string) || "Events";
    const date = (formData.get("date") as string) || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const file = formData.get("file") as File | null;
    let customSrc = (formData.get("src") as string) || "";

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    let fileId = "";
    if (file && file.size > 0) {
      const storage = getAppwriteStorage();
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const inputFile = InputFile.fromBuffer(buffer, file.name || "news_image.jpg");

      const uploadedFile = await storage.createFile(STORAGE_BUCKETS.NEWS_MEDIA, ID.unique(), inputFile);
      fileId = uploadedFile.$id;

      const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "";
      customSrc = `${endpoint}/storage/buckets/${STORAGE_BUCKETS.NEWS_MEDIA}/files/${fileId}/view?project=${projectId}`;
    }

    if (!customSrc) {
      return NextResponse.json({ success: false, error: "Please upload an image file" }, { status: 400 });
    }

    const newItem = await NewsItem.create({
      newsId: ID.unique(),
      title,
      category,
      date,
      src: customSrc,
      fileId,
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    console.error("Error in POST /api/admin/news:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create news item" },
      { status: 500 }
    );
  }
}
