import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/src/lib/mongodb";
import { getNextSequence } from "@/src/lib/getNextSequence";

export async function POST(req: Request) {
  try {
    // 1. Verify webhook
    const payload = await req.text();
    const headerPayload = Object.fromEntries((await headers()).entries());

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    const evt = wh.verify(payload, headerPayload) as WebhookEvent;

    // 2. Handle user.created
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
    return new Response("error", { status: 500 });
  }
}
