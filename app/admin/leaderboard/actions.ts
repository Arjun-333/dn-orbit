"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export async function updateScoreWeights(data: {
  githubWeight: number;
  lcWeight: number;
  eventWeight: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  // Enforce sum to 1.0
  const total = data.githubWeight + data.lcWeight + data.eventWeight;
  if (Math.abs(total - 1.0) > 0.01) {
    throw new Error("WEIGHT_SYNC_ERROR: TOTAL_SUM_MUST_BE_1.0");
  }

  await db.$transaction(async (tx) => {
    const existing = await tx.scoreWeight.findFirst();

    if (existing) {
      await tx.scoreWeight.update({
        where: { id: existing.id },
        data: {
          ...data,
          updatedBy: session.user.id,
        },
      });
    } else {
      await tx.scoreWeight.create({
        data: {
          ...data,
          updatedBy: session.user.id,
        },
      });
    }

    await logAction("WEIGHT_UPDATE", "config", "leaderboard_weights", { 
      weights: data,
      adminId: session.user.id 
    });
  });

  revalidatePath("/admin/leaderboard");
  revalidatePath("/leaderboard");
}
