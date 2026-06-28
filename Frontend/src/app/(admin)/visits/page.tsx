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

interface Book {
  id: number;
  book_title: string;
  grade_level: string;
}

interface Visit {
  id: number;
  visit_date: string;
  interest_level: string;
  notes: string | null;
  school: { id: number; name: string };
  contact_person: { id: number; name: string; position: string };
  assignedRep: { id: number; name: string };
  books_presented: Book[];
}

const INTEREST_COLORS: Record<string, string> = {
  Cold: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  Warm: "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400",
  Interested:
    "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  "Highly Interested":
    "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
};

export default function VisitsPage() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchVisits = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/visits?page=${page}`);
      setVisits(response.data.data);
      setCurrentPage(response.data.meta.current_page);
      setLastPage(response.data.meta.last_page);
    } catch (error) {
      console.error("Failed to fetch visits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits(currentPage);
  }, [currentPage]);

  const canWrite = user?.role === "admin" || user?.role === "sales_rep";

  return (
    <div>
      <PageBreadcrumb pageTitle="Visits Management" />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Visits
        </h2>
        {canWrite && (
          <Link href="/visits/create">
            <Button size="sm">Log Visit</Button>
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Visit Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    School
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Contact Person
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Books Presented
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Interest Level
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Notes
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
                      Loading visits...
                    </TableCell>
                  </TableRow>
                ) : visits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No visits found.
                    </TableCell>
                  </TableRow>
                ) : (
                  visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                        {visit.visit_date}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        {visit.school.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {visit.contact_person.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {visit.contact_person.position}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {visit.books_presented.length === 0 ? (
                          <span className="text-gray-400">—</span>
                        ) : (
                          <ul className="space-y-0.5">
                            {visit.books_presented.map((book) => (
                              <li
                                key={book.id}
                                className="text-xs text-gray-600 dark:text-gray-400"
                              >
                                <span className="font-medium">
                                  {book.book_title}
                                </span>{" "}
                                <span className="text-gray-400">
                                  ({book.grade_level})
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            INTEREST_COLORS[visit.interest_level] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {visit.interest_level}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 max-w-[200px]">
                        <p className="truncate">{visit.notes ?? "—"}</p>
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
