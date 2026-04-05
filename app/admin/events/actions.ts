"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createEvent(data: {
  title: string;
  description?: string;
  eventType?: string;
  eventDate: Date;
  location?: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const event = await db.event.create({
    data: {
      ...data,
      createdBy: session.user.id,
    },
  });

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
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const event = await db.event.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/events");
  return event;
}

export async function deleteEvent(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await db.event.delete({ where: { id } });

  revalidatePath("/admin/events");
}

export async function togglePublishEvent(id: string, currentStatus: boolean) {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await db.event.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });

  revalidatePath("/admin/events");
}
