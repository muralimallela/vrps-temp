import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import NewsItem from "@/src/models/NewsItem";
import { getAppwriteStorage, STORAGE_BUCKETS } from "@/src/lib/appwrite";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const item = await NewsItem.findById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: "News item not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const file = formData.get("file") as File | null;

    const updates: Record<string, any> = {};
    if (title) updates.title = title;
    if (category) updates.category = category;
    if (date) updates.date = date;

    if (file && file.size > 0) {
      const storage = getAppwriteStorage();
      
      // Delete old file if present
      if (item.fileId) {
        try {
          await storage.deleteFile(STORAGE_BUCKETS.NEWS_MEDIA, item.fileId);
        } catch (err) {
          console.warn("Could not delete old file from Appwrite storage:", err);
        }
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const inputFile = InputFile.fromBuffer(buffer, file.name || "news_image.jpg");
      const uploadedFile = await storage.createFile(STORAGE_BUCKETS.NEWS_MEDIA, ID.unique(), inputFile);

      const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "";
      updates.fileId = uploadedFile.$id;
      updates.src = `${endpoint}/storage/buckets/${STORAGE_BUCKETS.NEWS_MEDIA}/files/${uploadedFile.$id}/view?project=${projectId}`;
    }

    const updatedItem = await NewsItem.findByIdAndUpdate(id, { $set: updates }, { new: true });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    console.error("Error in PUT /api/admin/news/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update news item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const item = await NewsItem.findById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: "News item not found" }, { status: 404 });
    }

    if (item.fileId) {
      const storage = getAppwriteStorage();
      try {
        await storage.deleteFile(STORAGE_BUCKETS.NEWS_MEDIA, item.fileId);
      } catch (err) {
        console.warn("Could not delete file from Appwrite storage during document deletion:", err);
      }
    }

    await NewsItem.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "News item deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/news/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete news item" },
      { status: 500 }
    );
  }
}
