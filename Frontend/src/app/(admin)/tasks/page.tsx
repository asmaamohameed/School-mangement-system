"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import axiosClient from "@/lib/axios";
import Input from "@/components/form/input/InputField";
import { ChevronDownIcon, TrashBinIcon, PencilIcon } from "@/icons";
import { Task, TaskStatus, TASK_STATUS_OPTIONS } from "@/types/task";

const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  in_progress: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  completed: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
};

const TH_CLASS = "px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";

// ---------------------------------------------------------------------------
// Local sub-components
// ---------------------------------------------------------------------------

function TaskTableRow({
  task,
  canWrite,
  isAdmin,
  onDelete,
}: {
  task: Task;
  canWrite: boolean;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}) {
  return (
    <TableRow>
      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
        {task.title}
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 max-w-[220px]">
        <p className="truncate" title={task.description}>{task.description}</p>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        {task.school ? (
          <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            {task.school.name}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300 font-medium">
        {task.assigned_to?.name ?? <span className="text-gray-400">—</span>}
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-xs">
        {task.created_by?.name ?? "System"}
      </TableCell>
      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 font-mono text-sm">
        {task.due_date}
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[task.status] ?? "bg-gray-100 text-gray-600"}`}>
          {task.status.replace("_", " ")}
        </span>
      </TableCell>
      <TableCell className="px-5 py-4 text-start">
        <div className="flex items-center gap-3">
          {canWrite && (
            <Link
              href={`/tasks/${task.id}/edit`}
              className="text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
              title="Edit Task"
            >
              <PencilIcon className="w-5 h-5" />
            </Link>
          )}
          {isAdmin && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-error-500 hover:text-error-600 dark:text-error-500 dark:hover:text-error-400 transition-colors"
              title="Delete Task"
            >
              <TrashBinIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function TasksPage() {
  const { user } = useAuth();

  // Task list
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filter
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const canWrite = user?.role === "admin" || user?.role === "sales_rep";
  const isAdmin = user?.role === "admin";

  // --- Effects ---------------------------------------------------------------

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, debouncedSearch, filterStatus]);

  // --- Data fetching ---------------------------------------------------------

  const fetchTasks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (filterStatus) params.append("status", filterStatus);

      const response = await axiosClient.get(`/tasks?${params.toString()}`);
      setTasks(response.data.data);
      setCurrentPage(response.data.meta.current_page);
      setLastPage(response.data.meta.last_page);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axiosClient.delete(`/tasks/${id}`);
      fetchTasks(currentPage);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Tasks Management" />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Tasks</h2>
        {canWrite && (
          <Link href="/tasks/create">
            <Button size="sm">Create Task</Button>
          </Link>
        )}
      </div>

      {/* Search & filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by title, description or school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative min-w-[200px]">
          <select
            className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 ${
              filterStatus ? "text-gray-800 dark:text-white/90" : "text-gray-400"
            }`}
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Statuses</option>
            {TASK_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      {/* Tasks table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1100px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className={TH_CLASS}>Title</TableCell>
                  <TableCell isHeader className={TH_CLASS}>Description</TableCell>
                  <TableCell isHeader className={TH_CLASS}>Associated School</TableCell>
                  <TableCell isHeader className={TH_CLASS}>Assignee</TableCell>
                  <TableCell isHeader className={TH_CLASS}>Created By</TableCell>
                  <TableCell isHeader className={TH_CLASS}>Due Date</TableCell>
                  <TableCell isHeader className={TH_CLASS}>Status</TableCell>
                  <TableCell isHeader className={TH_CLASS}>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Loading tasks...</TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">No tasks found.</TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TaskTableRow
                      key={task.id}
                      task={task}
                      canWrite={canWrite}
                      isAdmin={isAdmin}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {currentPage} of {lastPage}</span>
          <button
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
