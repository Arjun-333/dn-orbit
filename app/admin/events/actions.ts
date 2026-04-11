"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export async function createEvent(data: {
  title: string;
  description?: string;
  eventType?: string;
  eventDate: Date;
  location?: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  const event = await db.event.create({
    data: {
      ...data,
      createdBy: session.user.id,
    },
  });

  await logAction("EVENT_CREATE", "event", event.id, { adminId: session.user.id });
  revalidatePath("/admin/events");
  return event;
}

export async function updateEvent(id: string, data: Partial<{
  title: string;
  description: string;
  eventType: string;
  eventDate: Date;
  location: string;
  isPublished: boolean;
}>) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  const event = await db.event.update({
    where: { id },
    data,
  });

  await logAction("EVENT_UPDATE", "event", id, { adminId: session.user.id, fields: Object.keys(data) });
  revalidatePath("/admin/events");
  return event;
}

export async function deleteEvent(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  await db.event.delete({ where: { id } });

  await logAction("EVENT_DELETE", "event", id, { adminId: session.user.id });
  revalidatePath("/admin/events");
}

export async function togglePublishEvent(id: string, currentStatus: boolean) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("UNAUTHORIZED_ACCESS: ADMIN_CLEARANCE_REQUIRED");

  await db.event.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });

  await logAction("EVENT_TOGGLE_PUBLISH", "event", id, { 
    adminId: session.user.id, 
    newStatus: !currentStatus 
  });
  revalidatePath("/admin/events");
}
