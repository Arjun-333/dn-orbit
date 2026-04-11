import { db } from "./db";
import { auth } from "./auth";
import { Prisma } from "@prisma/client";

export type AuditAction = 
  | "PROJECT_APPROVE" 
  | "PROJECT_DELETE" 
  | "PROJECT_STATUS_UPDATE"
  | "MEMBER_ROLE_UPDATE"
  | "MEMBER_VISIBILITY_TOGGLE"
  | "EVENT_CREATE"
  | "EVENT_UPDATE"
  | "EVENT_DELETE"
  | "EVENT_TOGGLE_PUBLISH"
  | "WEIGHT_UPDATE";

export type AuditResource = "project" | "user" | "event" | "config";

export async function logAction(
  action: AuditAction,
  resource: AuditResource,
  resourceId?: string,
  metadata: Record<string, unknown> = {}
) {
  try {
    const session = await auth();
    const actorId = session?.user?.id || "SYSTEM";

    await db.auditLog.create({
      data: {
        actorId,
        action,
        resource,
        resourceId,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    // We don't want audit logging failures to crash the main operation,
    // but in a production environment we should at least log them to stderr.
    console.error("AUDIT_LOG_FAILURE:", err);
  }
}
