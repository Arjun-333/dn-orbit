"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateScoreWeights(data: {
  githubWeight: number;
  lcWeight: number;
  eventWeight: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  // Enforce sum to 1.0 (optional but recommended for normalization)
  const total = data.githubWeight + data.lcWeight + data.eventWeight;
  if (Math.abs(total - 1.0) > 0.01) {
    throw new Error("WEIGHT_ERROR: TOTAL_SUM_MUST_BE_1.0");
  }

  const existing = await db.scoreWeight.findFirst();

  if (existing) {
    await db.scoreWeight.update({
      where: { id: existing.id },
      data: {
        ...data,
        updatedBy: session.user.id,
      },
    });
  } else {
    await db.scoreWeight.create({
      data: {
        ...data,
        updatedBy: session.user.id,
      },
    });
  }

  revalidatePath("/admin/leaderboard");
  revalidatePath("/leaderboard"); // Update the public page too
}
