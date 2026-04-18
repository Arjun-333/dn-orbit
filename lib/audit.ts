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

/**
 * Records an administrative action in the persistent audit registry.
 * 
 * @param action - The category of action performed
 * @param resource - The type of resource affected
 * @param resourceId - The ID of the entity affected
 * @param metadata - Optional key-value pairs for additional context
 */
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
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : {},
      },
    });
  } catch (err) {
    // We don't want audit logging failures to crash the main operation,
    // but in a production environment we should at least log them to stderr.
    console.error("AUDIT_LOG_FAILURE:", err);
  }
}
