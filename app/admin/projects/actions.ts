"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approveProject(projectId: string) {
  await db.project.update({
    where: { id: projectId },
    data: { isApproved: true }
  });
  revalidatePath("/admin/projects");
}

export async function deleteProject(projectId: string) {
  await db.project.delete({
    where: { id: projectId }
  });
  revalidatePath("/admin/projects");
}

export async function updateProjectStatus(projectId: string, status: "planning" | "active" | "completed" | "stalled") {
  await db.project.update({
    where: { id: projectId },
    data: { status }
  });
  revalidatePath("/admin/projects");
}
