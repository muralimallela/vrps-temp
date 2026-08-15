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

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const member = await CommitteeMember.findById(id);

    if (!member) {
      return NextResponse.json({ success: false, error: "Committee member not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const designation = formData.get("designation") as string;
    const role = formData.get("role") as string;
    const order = formData.get("order");
    const file = formData.get("file") as File | null;

    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (designation) updates.designation = designation;
    if (role) updates.role = role;
    if (order !== null && order !== undefined) updates.order = Number(order);

    const bucketId = STORAGE_BUCKETS.COMMITTEE_MEDIA;

    if (file && file.size > 0) {
      const storage = getAppwriteStorage();
      await ensureBucketExists(storage, bucketId);

      // Delete old file if present
      if (member.fileId) {
        try {
          await storage.deleteFile(bucketId, member.fileId);
        } catch (err) {}
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const inputFile = InputFile.fromBuffer(buffer, file.name || "committee_photo.jpg");
      const uploadedFile = await storage.createFile(bucketId, ID.unique(), inputFile);

      const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "";
      updates.fileId = uploadedFile.$id;
      updates.image = `${endpoint}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${projectId}`;
    }

    const updatedMember = await CommitteeMember.findByIdAndUpdate(id, { $set: updates }, { new: true });

    return NextResponse.json({ success: true, data: updatedMember });
  } catch (error: any) {
    console.error("Error in PUT /api/admin/committee/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update committee member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const member = await CommitteeMember.findById(id);

    if (!member) {
      return NextResponse.json({ success: false, error: "Committee member not found" }, { status: 404 });
    }

    if (member.fileId) {
      const storage = getAppwriteStorage();
      try {
        await storage.deleteFile(STORAGE_BUCKETS.COMMITTEE_MEDIA, member.fileId);
      } catch (err) {}
    }

    await CommitteeMember.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Committee member deleted successfully" });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/committee/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete committee member" },
      { status: 500 }
    );
  }
}
