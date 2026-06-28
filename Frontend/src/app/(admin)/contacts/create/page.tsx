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

export default function CreateContactPage() {
  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");

  // Schools dropdown
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);

  // Submission state
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Fetch all schools for the dropdown (no pagination — flat list)
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // Fetch enough records to fill the dropdown
        const response = await axiosClient.get("/schools?per_page=100");
        setSchools(response.data.data);
      } catch (error) {
        console.error("Failed to fetch schools", error);
      } finally {
        setSchoolsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      name,
      position,
      mobile,
      email: email || null,
      school_id: schoolId ? Number(schoolId) : null,
    };

    try {
      await axiosClient.post("/contacts", payload);
      router.push("/contacts");
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Form submission failed", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageBreadcrumb pageTitle="Create Contact" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label>
              Name <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              hint={errors.name?.[0]}
              disabled={loading}
            />
          </div>

          {/* Position */}
          <div>
            <Label>
              Position <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              error={!!errors.position}
              hint={errors.position?.[0]}
              disabled={loading}
            />
          </div>

          {/* Mobile */}
          <div>
            <Label>
              Mobile <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              error={!!errors.mobile}
              hint={errors.mobile?.[0]}
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              hint={errors.email?.[0]}
              disabled={loading}
            />
          </div>

          {/* Associated School — dropdown */}
          <div>
            <Label>
              Associated School <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${
                  schoolId
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400"
                } ${errors.school_id ? "border-error-500" : ""}`}
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                disabled={loading || schoolsLoading}
              >
                <option value="" disabled>
                  {schoolsLoading ? "Loading schools..." : "Select a school"}
                </option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
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

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/contacts")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Contact"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
