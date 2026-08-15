import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import CommitteeMember from "@/src/models/CommitteeMember";
import { getAppwriteStorage, STORAGE_BUCKETS } from "@/src/lib/appwrite";
import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

async function ensureBucketExists(storage: any, bucketId: string) {
  try {
    await storage.getBucket(bucketId);
  } catch (err: any) {
    if (err?.code === 404) {
      try {
        await storage.createBucket(bucketId, "Committee Media", [Permission.read(Role.any())], false, true);
      } catch (e: any) {}
    }
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const members = await CommitteeMember.find({}, { sort: { order: 1 } });
    return NextResponse.json({ success: true, data: members });
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

    const name = formData.get("name") as string;
    const designation = (formData.get("designation") as string) || "Executive Member";
    const role = (formData.get("role") as string) || "Executive Committee";
    const order = Number(formData.get("order") || 1);
    const file = formData.get("file") as File | null;
    let customImage = (formData.get("image") as string) || "";

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    let fileId = "";
    const bucketId = STORAGE_BUCKETS.COMMITTEE_MEDIA;

    if (file && file.size > 0) {
      const storage = getAppwriteStorage();
      await ensureBucketExists(storage, bucketId);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const inputFile = InputFile.fromBuffer(buffer, file.name || "committee_photo.jpg");

      const uploadedFile = await storage.createFile(bucketId, ID.unique(), inputFile);
      fileId = uploadedFile.$id;

      const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "";
      customImage = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
    }

    if (!customImage) {
      customImage = "/committee/santhosh.jpeg"; // Fallback placeholder
    }

    const newMember = await CommitteeMember.create({
      memberId: ID.unique(),
      name,
      designation,
      role,
      image: customImage,
      fileId,
      order,
    });

    return NextResponse.json({ success: true, data: newMember });
  } catch (error: any) {
    console.error("Error in POST /api/admin/committee:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create committee member" },
      { status: 500 }
    );
  }
}
