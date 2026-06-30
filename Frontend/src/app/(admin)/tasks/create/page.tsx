"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import axiosClient from "@/lib/axios";
import { ChevronDownIcon } from "@/icons";

interface School {
  id: number;
  name: string;
}

interface UserItem {
  id: number;
  name: string;
  role: string;
}

export default function CreateTaskPage() {
  const router = useRouter();

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Dropdowns data
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  // Submission state
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Fetch schools and users on mount
  useEffect(() => {
    axiosClient
      .get("/schools?per_page=100")
      .then((res) => setSchools(res.data.data || []))
      .catch(console.error)
      .finally(() => setSchoolsLoading(false));

    axiosClient
      .get("/users")
      .then((res) => setUsers(res.data.data || []))
      .catch(console.error)
      .finally(() => setUsersLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      title,
      description,
      school_id: schoolId ? Number(schoolId) : null,
      assigned_to: assignedTo ? Number(assignedTo) : null,
      due_date: dueDate,
      status: "pending", // Default required by backend StoreTaskRequest
    };

    try {
      await axiosClient.post("/tasks", payload);
      router.push("/tasks");
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Failed to create task", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageBreadcrumb pageTitle="Create Task" />

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
              placeholder="Enter task title"
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
              placeholder="Enter task details/description..."
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

          {/* Associated School */}
          <div>
            <Label>
              Associated School <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 ${
                  schoolId
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400"
                } ${errors.school_id ? "border-error-500" : "border-gray-300"}`}
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                disabled={loading || schoolsLoading}
              >
                <option value="" disabled>
                  {schoolsLoading ? "Loading schools..." : "Select school"}
                </option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.school_id && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.school_id[0]}
              </p>
            )}
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
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
