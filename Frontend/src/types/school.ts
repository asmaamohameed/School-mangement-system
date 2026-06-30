/**
 * Shared type definitions for School resources.
 *
 * These types mirror the backend `SchoolResource` API response shape and
 * the `SchoolStage` PHP enum.
 */

/**
 * Backend SchoolStage enum values — must match exactly.
 * PHP: lead | qualified | interested | follow_up | won | lost
 */
export type SchoolStage =
  | "lead"
  | "qualified"
  | "interested"
  | "follow_up"
  | "won"
  | "lost";

/** Human-readable labels for each stage value */
export const SCHOOL_STAGE_OPTIONS: { value: SchoolStage; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "qualified", label: "Qualified" },
  { value: "interested", label: "Interested" },
  { value: "follow_up", label: "Follow Up" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

/** School record as returned by GET /api/schools */
export interface School {
  id: number;
  name: string;
  school_type: string;
  city: string;
  address: string;
  principal_name: string | null;
  principal_mobile: string | null;
  /** Value is always a valid SchoolStage enum member */
  stage: SchoolStage;
  assigned_rep?: { id: number; name: string } | null;
}

/**
 * Payload for POST /api/schools
 *
 * NOTE: `created_by` and `assigned_to` must NOT be sent from the client —
 * the backend automatically injects the logged-in user identity.
 *
 * `principal_name` and `principal_mobile` are NOW STRICTLY REQUIRED.
 */
export interface CreateSchoolPayload {
  name: string;
  school_type: string;
  city: string;
  address: string;
  /** Required — backend enforces this as of the 2026-06 schema update */
  principal_name: string;
  /** Required — backend enforces this as of the 2026-06 schema update */
  principal_mobile: string;
}

/**
 * Payload for PUT /api/schools/{id}
 *
 * All fields are optional (PATCH-style), but if `stage` is included it must
 * be a valid `SchoolStage` enum value or the backend returns a 422.
 */
export interface UpdateSchoolPayload {
  name?: string;
  school_type?: string;
  city?: string;
  address?: string;
  principal_name?: string | null;
  principal_mobile?: string | null;
  /** When present, must strictly match one of the SchoolStage enum values */
  stage?: SchoolStage;
}
