"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export async function updateUserRole(userId: string, newRole: "admin" | "member") {
  const session = await auth();

  // 1. Auth check
  if (session?.user?.role !== "admin") {
    throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");
  }

  // 2. Prevent self-demotion
  if (session.user.id === userId && newRole === "member") {
    throw new Error("SECURITY_RESTRICTION: SELF_DEMOTION_IS_DENIED");
  }

  // 3. Update DB
  await db.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // 4. Log Action
  await logAction("MEMBER_ROLE_UPDATE", "user", userId, { 
    newRole,
    adminId: session.user.id 
  });

  // 5. Revalidate
  revalidatePath("/admin/members");
}
