import AuditLog from "@/src/models/AuditLog";

type AuditPayload = {
  entityType: string;
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
  actorUserId?: string;
  source: "api" | "webhook" | "admin";
};

export async function writeAuditLog(payload: AuditPayload) {
  await AuditLog.create({
    entityType: payload.entityType,
    entityId: payload.entityId,
    action: payload.action,
    before: payload.before ?? null,
    after: payload.after ?? null,
    actorUserId: payload.actorUserId ?? "",
    source: payload.source,
  });
}

