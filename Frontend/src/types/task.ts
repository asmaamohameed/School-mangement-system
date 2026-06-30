/**
 * Shared type definitions for Task resources.
 *
 * These types mirror the backend `TaskResource` API response shape.
 */

export type TaskStatus = "pending" | "in_progress" | "completed";

export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  school?: { id: number; name: string } | null;
  assigned_to?: { id: number; name: string } | null;
  created_by?: { id: number; name: string } | null;
}

export interface CreateTaskPayload {
  school_id: number;
  assigned_to: number;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  assigned_to?: number;
  status?: TaskStatus;
  due_date?: string;
}
