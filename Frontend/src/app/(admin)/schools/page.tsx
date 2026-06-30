"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import axiosClient from "@/lib/axios";
import { ChevronDownIcon, TrashBinIcon, PencilIcon } from "@/icons";

interface School {
  id: number;
  name: string;
  school_type: string;
  city: string;
  address: string;
  principal_name: string | null;
  principal_mobile: string | null;
  stage: string;
}

export default function SchoolsPage() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchSchools = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/schools?page=${page}`);
      setSchools(response.data.data);
      setCurrentPage(response.data.meta.current_page);
      setLastPage(response.data.meta.last_page);
    } catch (error) {
      console.error("Failed to fetch schools", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools(currentPage);
  }, [currentPage]);

  const handleDeleteSchool = async (id: number) => {
    if (!confirm("Are you sure you want to delete this school?")) return;
    try {
      await axiosClient.delete(`/schools/${id}`);
      fetchSchools(currentPage);
    } catch (error) {
      console.error("Failed to delete school", error);
    }
  };

  const canWrite = user?.role === "admin" || user?.role === "sales_rep";
  const isAdmin = user?.role === "admin";

  return (
    <div>
      <PageBreadcrumb pageTitle="Schools Management" />

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Schools</h2>
        {canWrite && (
          <Link href="/schools/create">
            <Button size="sm">Create School</Button>
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">School Name</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">City</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Address</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Principal</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Stage</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">Loading schools...</TableCell>
                  </TableRow>
                ) : schools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">No schools found.</TableCell>
                  </TableRow>
                ) : (
                  schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">{school.name}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 capitalize">{school.school_type}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{school.city}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{school.address}</TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        {school.principal_name ? (
                          <div>
                            <div className="font-medium text-gray-700 dark:text-gray-300">{school.principal_name}</div>
                            <div className="text-xs text-gray-400">{school.principal_mobile}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          school.stage === "won" ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400" :
                          school.stage === "lost" ? "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400" :
                          "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400"
                        }`}>
                          {school.stage}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          {canWrite && (
                            <Link href={`/schools/${school.id}/edit`} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium">
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                          )}
                          {isAdmin && (
                            <button onClick={() => handleDeleteSchool(school.id)} className="text-error-500 hover:text-error-600 text-sm font-medium">
                              <TrashBinIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {lastPage > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {currentPage} of {lastPage}</span>
          <button disabled={currentPage === lastPage} onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
