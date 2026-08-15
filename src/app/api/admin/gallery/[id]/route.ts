import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import GalleryItem from "@/src/models/GalleryItem";
import { getAppwriteStorage, STORAGE_BUCKETS } from "@/src/lib/appwrite";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { writeAuditLog } from "@/src/lib/audit";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const item = await GalleryItem.findById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }

    const beforeState = item.toJSON ? item.toJSON() : item;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const featured = formData.get("featured") === "true";
    const file = formData.get("file") as File | null;

    const updates: Record<string, any> = {};
    if (title) updates.title = title;
    if (category) updates.category = category;
    if (date) updates.date = date;
    if (location !== undefined && location !== null) updates.location = location;
    if (description !== undefined && description !== null) updates.description = description;
    updates.featured = featured;

    const bucket = STORAGE_BUCKETS.GALLERY_MEDIA || STORAGE_BUCKETS.NEWS_MEDIA;

    if (file && file.size > 0) {
      const storage = getAppwriteStorage();

      // Delete old file if present
      if (item.fileId) {
        try {
          await storage.deleteFile(bucket, item.fileId);
        } catch (err) {
          console.warn("Could not delete old file from Appwrite storage:", err);
        }
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const inputFile = InputFile.fromBuffer(buffer, file.name || "gallery_image.jpg");
      const uploadedFile = await storage.createFile(bucket, ID.unique(), inputFile);

      const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "";
      updates.fileId = uploadedFile.$id;
      updates.src = `${endpoint}/storage/buckets/${bucket}/files/${uploadedFile.$id}/view?project=${projectId}`;
    }

    const updatedItem = await GalleryItem.findByIdAndUpdate(id, { $set: updates }, { new: true });

    await writeAuditLog({
      entityType: "gallery_item",
      entityId: id,
      action: "update",
      before: beforeState,
      after: updatedItem?.toJSON ? updatedItem.toJSON() : updatedItem,
      actorUserId: admin.userId || "admin",
      source: "admin",
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    console.error("Error in PUT /api/admin/gallery/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const item = await GalleryItem.findById(id);

    if (!item) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }

    const beforeState = item.toJSON ? item.toJSON() : item;
    const bucket = STORAGE_BUCKETS.GALLERY_MEDIA || STORAGE_BUCKETS.NEWS_MEDIA;

    if (item.fileId) {
      const storage = getAppwriteStorage();
      try {
        await storage.deleteFile(bucket, item.fileId);
      } catch (err) {
        console.warn("Could not delete file from Appwrite storage during deletion:", err);
      }
    }

    await GalleryItem.findByIdAndDelete(id);

    await writeAuditLog({
      entityType: "gallery_item",
      entityId: id,
      action: "delete",
      before: beforeState,
      actorUserId: admin.userId || "admin",
      source: "admin",
    });

    return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/gallery/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
