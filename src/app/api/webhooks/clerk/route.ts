import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { connectDB } from "@/src/lib/mongodb";
import { getNextSequence } from "@/src/lib/getNextSequence";

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

            const userId = evt.data.id;
            const nextNum = await getNextSequence("userCounter");

            const uniqueId = `VRPS25${String(nextNum).padStart(5, "0")}`;
            console.log("Generated ID:", uniqueId);

            const client = await clerkClient();
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    memberId: uniqueId,
                },
            });


        }

        return new Response("ok", { status: 200 });
    } catch (err) {
        console.error("Webhook error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return new Response(`Webhook Error: ${errorMessage}`, { status: 500 });
    }
}