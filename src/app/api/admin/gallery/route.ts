import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import GalleryItem from "@/src/models/GalleryItem";
import { getAppwriteStorage, STORAGE_BUCKETS } from "@/src/lib/appwrite";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { writeAuditLog } from "@/src/lib/audit";

export async function GET() {
  try {
    await requireAdmin();
    const items = await GalleryItem.find({}, { sort: { createdAt: -1 } });
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
    const admin = await requireAdmin();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const category = (formData.get("category") as string) || "Conventions";
    const date = (formData.get("date") as string) || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const location = (formData.get("location") as string) || "";
    const description = (formData.get("description") as string) || "";
    const featured = formData.get("featured") === "true";
    const file = formData.get("file") as File | null;
    let customSrc = (formData.get("src") as string) || "";

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    let fileId = "";
    const bucket = STORAGE_BUCKETS.GALLERY_MEDIA || STORAGE_BUCKETS.NEWS_MEDIA;

    if (file && file.size > 0) {
      const storage = getAppwriteStorage();
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const inputFile = InputFile.fromBuffer(buffer, file.name || "gallery_image.jpg");

      const uploadedFile = await storage.createFile(bucket, ID.unique(), inputFile);
      fileId = uploadedFile.$id;

      const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "";
      customSrc = `${endpoint}/storage/buckets/${bucket}/files/${fileId}/view?project=${projectId}`;
    }

    if (!customSrc) {
      return NextResponse.json({ success: false, error: "Please upload an image file" }, { status: 400 });
    }

    const newItem = await GalleryItem.create({
      galleryId: ID.unique(),
      title,
      category,
      date,
      location,
      description,
      src: customSrc,
      fileId,
      featured,
    });

    await writeAuditLog({
      entityType: "gallery_item",
      entityId: newItem.$id,
      action: "create",
      after: newItem.toJSON ? newItem.toJSON() : newItem,
      actorUserId: admin.userId || "admin",
      source: "admin",
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    console.error("Error in POST /api/admin/gallery:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
