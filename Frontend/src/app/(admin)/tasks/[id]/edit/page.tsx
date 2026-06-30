"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import axiosClient from "@/lib/axios";
import { ChevronDownIcon } from "@/icons";
import { TaskStatus, TASK_STATUS_OPTIONS } from "@/types/task";

interface UserItem {
  id: number;
  name: string;
  role: string;
}

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schoolName, setSchoolName] = useState(""); // Read-only view
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");

  // Users dropdown
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // States
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Fetch users & task details
  useEffect(() => {
    // 1. Fetch Users
    axiosClient
      .get("/users")
      .then((res) => setUsers(res.data.data || []))
      .catch(console.error)
      .finally(() => setUsersLoading(false));

    // 2. Fetch Task details
    if (id) {
      axiosClient
        .get(`/tasks/${id}`)
        .then((res) => {
          const task = res.data.data;
          setTitle(task.title || "");
          setDescription(task.description || "");
          setSchoolName(task.school?.name || "System/No School");
          setAssignedTo(task.assigned_to?.id ? String(task.assigned_to.id) : "");
          setDueDate(task.due_date || "");
          setStatus(task.status || "pending");
        })
        .catch((err) => {
          if (err.response?.status !== 403) {
            console.error("Failed to fetch task details", err);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      title,
      description,
      assigned_to: assignedTo ? Number(assignedTo) : null,
      due_date: dueDate,
      status,
    };

    try {
      await axiosClient.put(`/tasks/${id}`, payload);
      router.push("/tasks");
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else if (error.response?.status !== 403) {
        console.error("Failed to update task", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageBreadcrumb pageTitle="Edit Task" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label>
              Title <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              hint={errors.title?.[0]}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <Label>
              Description <span className="text-error-500">*</span>
            </Label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="Enter task details..."
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-800 resize-none ${
                errors.description ? "border-error-500 focus:ring-error-500/10" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.description[0]}
              </p>
            )}
          </div>

          {/* School - Read-only */}
          <div>
            <Label>Associated School</Label>
            <Input
              type="text"
              value={schoolName}
              disabled={true}
              className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">
              School association cannot be modified after task creation.
            </p>
          </div>

          {/* Assignee */}
          <div>
            <Label>
              Assignee <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 ${
                  assignedTo
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400"
                } ${errors.assigned_to ? "border-error-500" : "border-gray-300"}`}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={loading || usersLoading}
              >
                <option value="" disabled>
                  {usersLoading ? "Loading users..." : "Select assignee"}
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.replace("_", " ")})
                  </option>
                ))}
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.assigned_to && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.assigned_to[0]}
              </p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <Label>
              Due Date <span className="text-error-500">*</span>
            </Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              error={!!errors.due_date}
              hint={errors.due_date?.[0]}
              disabled={loading}
            />
          </div>

          {/* Status */}
          <div>
            <Label>
              Status <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 ${
                  status ? "text-gray-800 dark:text-white/90" : "text-gray-400"
                } ${errors.status ? "border-error-500" : "border-gray-300"}`}
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={loading}
              >
                {TASK_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.status && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.status[0]}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/tasks")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
