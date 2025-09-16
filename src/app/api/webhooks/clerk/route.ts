// app/api/webhooks/clerk/route.ts
import { getNextSequence } from "@/src/lib/getNextSequence";
import { connectDB } from "@/src/lib/mongodb";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";


export async function POST(req: Request) {
    try {
        const evt = (await req.json()) as WebhookEvent;

        if (evt.type === "user.created") {
            await connectDB(); // ensure MongoDB connection

            const userId = evt.data.id;

            // Get next counter
            const nextNum = await getNextSequence("userCounter");

            // Format unique ID
            const uniqueId = `VRPS25${String(nextNum).padStart(5, "0")}`;
            console.log(uniqueId);

            // Store in publicMetadata
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
        return new Response("error", { status: 500 });
    }
}
