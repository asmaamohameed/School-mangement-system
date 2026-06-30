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

/**
 * FollowUp type — mirrors the backend FollowUpResource shape.
 *
 * Key renames applied per API schema update:
 *   user_id       → done_by  (object with id & name)
 *   follow_up_type → type
 */
interface FollowUp {
  id: number;
  follow_up_date: string;
  /** Renamed from `follow_up_type` — matches backend FollowUpResource `type` key */
  type: string;
  summary: string;
  next_action: string | null;
  school: { id: number; name: string };
  /** Renamed from `user` — matches backend FollowUpResource `done_by` key */
  done_by: { id: number; name: string };
}

const TYPE_COLORS: Record<string, string> = {
  call: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  meeting:
    "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  note: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

export default function FollowUpsPage() {
  const { user } = useAuth();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchFollowUps = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/follow-ups?page=${page}`);
      setFollowUps(response.data.data);
      setCurrentPage(response.data.meta.current_page);
      setLastPage(response.data.meta.last_page);
    } catch (error) {
      console.error("Failed to fetch follow-ups", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps(currentPage);
  }, [currentPage]);

  const canWrite = user?.role === "admin" || user?.role === "customer_service";

  return (
    <div>
      <PageBreadcrumb pageTitle="Customer Follow-Ups" />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Follow-Ups
        </h2>
        {canWrite && (
          <Link href="/follow-ups/create">
            <Button size="sm">Log Follow-Up</Button>
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Follow-Up Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    School / Lead
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Summary
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Done By
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Next Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      Loading follow-ups...
                    </TableCell>
                  </TableRow>
                ) : followUps.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No follow-ups found.
                    </TableCell>
                  </TableRow>
                ) : (
                  followUps.map((fu) => (
                    <TableRow key={fu.id}>
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                        {fu.follow_up_date}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        {fu.school.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {/* Bound to `fu.type` — renamed from `fu.follow_up_type` */}
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            TYPE_COLORS[fu.type] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {fu.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 max-w-[240px]">
                        <p className="truncate">{fu.summary}</p>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        {/* Bound to `fu.done_by` — renamed from `fu.user` */}
                        {fu.done_by?.name ?? "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 max-w-[200px]">
                        <p className="truncate">{fu.next_action ?? "—"}</p>
                      </TableCell>
                    </TableRow>
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
          <span className="text-sm text-gray-500">
            Page {currentPage} of {lastPage}
          </span>
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
