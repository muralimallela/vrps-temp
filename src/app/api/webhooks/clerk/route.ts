import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { connectDB } from "@/src/lib/mongodb";
import { generateUserId } from "@/src/lib/ids";
import User from "@/src/models/User";
import Address from "@/src/models/Address";
import { writeAuditLog } from "@/src/lib/audit";

export async function POST(req: Request) {
    try {
        // 1. Get body and headers
        const payload = await req.text();
        const headerPayload = await headers();

        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        // Check if headers are present
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response("Error occurred -- no svix headers", {
                status: 400,
            });
        }

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

        // 2. Verify signature
        const evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;

        // 3. Handle user.created event
        if (evt.type === "user.created") {
            await connectDB();
            const clerkUserId = evt.data.id;
            const existing = await User.findOne({ clerkUserId, isDeleted: { $ne: true } });
            if (!existing) {
                const email = (evt.data.email_addresses?.find(
                    (entry) => entry.id === evt.data.primary_email_address_id
                )?.email_address ?? "").trim().toLowerCase();
                const mobile = (evt.data.phone_numbers?.find(
                    (entry) => entry.id === evt.data.primary_phone_number_id
                )?.phone_number ?? "").trim();

                const userId = await generateUserId();
                const name = `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim() || "User";

                await User.create({
                    clerkUserId,
                    userId,
                    name,
                    mobile,
                    email,
                    photoUrl: evt.data.image_url ?? "",
                    roles: ["user"],
                    isMember: false,
                });

                const client = await clerkClient();
                await client.users.updateUserMetadata(clerkUserId, {
                    publicMetadata: { userId },
                });
            }
        }

        if (evt.type === "user.deleted") {
            await connectDB();
            const clerkUserId = evt.data.id;
            const user = await User.findOne({ clerkUserId });
            if (user) {
                const before = user.toObject();
                const oldUserId = user.userId;

                await Address.deleteMany({ userId: oldUserId });

                user.name = "Deleted User";
                user.email = `deleted+${oldUserId.toLowerCase()}@vrps.local`;
                user.mobile = `deleted_${oldUserId.toLowerCase()}`;
                user.photoUrl = "";
                user.addressId = null;
                user.isDeleted = true;
                user.deletedAt = new Date();
                user.roles = ["user"];
                user.clerkUserId = `deleted_${oldUserId}_${Date.now()}`;
                await user.save();

                await writeAuditLog({
                    entityType: "user",
                    entityId: oldUserId,
                    action: "user.soft_deleted_from_clerk",
                    before,
                    after: user.toObject(),
                    actorUserId: oldUserId,
                    source: "webhook",
                });
            }
        }

        return new Response("ok", { status: 200 });
    } catch (err) {
        console.error("Webhook error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return new Response(`Webhook Error: ${errorMessage}`, { status: 500 });
    }
}
