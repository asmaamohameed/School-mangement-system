/**
 * Shared type definitions for Follow-Up resources.
 *
 * These types mirror the backend `FollowUpResource` API response shape.
 *
 * Key renames applied in the 2026-06 API schema update:
 *   user_id        → done_by  (nested object: { id, name })
 *   follow_up_type → type
 */

/** Strict union of backend FollowUpType enum values */
export type FollowUpType = "call" | "meeting" | "note";

/**
 * Full follow-up record as returned by GET /api/follow-ups
 * and GET /api/follow-ups/{id}.
 */
export interface FollowUp {
  id: number;
  /** ISO date-time string (Y-m-d H:i format) */
  follow_up_date: string;
  /** Follow-up channel type — renamed from `follow_up_type` */
  type: FollowUpType;
  summary: string;
  next_action: string | null;
  school: { id: number; name: string };
  /** The user who logged this follow-up — renamed from `user` / `user_id` */
  done_by: { id: number; name: string };
  /** ISO date-time string (Y-m-d H:i format) */
  created_at: string;
}

/**
 * Payload for POST /api/follow-ups
 *
 * NOTE: `done_by` / `user_id` must NOT be sent from the client — the backend
 * automatically injects the authenticated user.
 */
export interface CreateFollowUpPayload {
  school_id: number;
  follow_up_date: string;
  /** Must be one of the FollowUpType enum values */
  type: FollowUpType;
  summary: string;
  next_action?: string | null;
}
