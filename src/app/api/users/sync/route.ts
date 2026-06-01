import { connectDB } from "@/src/lib/mongodb";
import { getCurrentAppUser } from "@/src/lib/auth";
import { fail, ok } from "@/src/lib/http";

export async function POST() {
  try {
    await connectDB();
    const user = await getCurrentAppUser();
    if (!user) return fail("Unauthorized", 401);
    return ok(user);
  } catch (error) {
    return fail(error, 500);
  }
}

