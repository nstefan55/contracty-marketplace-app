"use server";

import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import User from "@/models/User";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

export async function toggleBookmark(contractorId) {
  const session = await auth();
  if (!session) throw new Error("Sign in to bookmark contractors");

  await checkActionRateLimit(`bookmark-${session.user.id}`);

  await connectDB();

  const user = await User.findById(session.user.id);
  if (!user) throw new Error("User not found");

  const alreadyBookmarked = user.bookmarks.some(
    (id) => id.toString() === contractorId,
  );

  if (alreadyBookmarked) {
    await User.updateOne(
      { _id: session.user.id },
      { $pull: { bookmarks: contractorId } },
    );
  } else {
    await User.updateOne(
      { _id: session.user.id },
      { $addToSet: { bookmarks: contractorId } },
    );
  }
}
