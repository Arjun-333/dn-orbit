"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";
import { auth } from "@/lib/auth";

export async function approveProject(projectId: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  await db.project.update({
    where: { id: projectId },
    data: { isApproved: true }
  });

  await logAction("PROJECT_APPROVE", "project", projectId, { adminId: session.user.id });
  revalidatePath("/admin/projects");
}

export async function deleteProject(projectId: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  await db.project.delete({
    where: { id: projectId }
  });

  await logAction("PROJECT_DELETE", "project", projectId, { adminId: session.user.id });
  revalidatePath("/admin/projects");
}

export async function updateProjectStatus(projectId: string, status: "planning" | "active" | "completed" | "stalled") {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  await db.project.update({
    where: { id: projectId },
    data: { status }
  });

  await logAction("PROJECT_STATUS_UPDATE", "project", projectId, { adminId: session.user.id, status });
  revalidatePath("/admin/projects");
}
