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

// Matches FollowUpType enum values on the backend
const FOLLOW_UP_TYPES = [
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" },
];

export default function CreateFollowUpPage() {
  const router = useRouter();

  // Dropdowns data
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);

  // Form fields
  const [schoolId, setSchoolId] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [type, setType] = useState("");
  const [summary, setSummary] = useState("");
  const [nextAction, setNextAction] = useState("");

  // Submission state
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/schools?per_page=100")
      .then((res) => setSchools(res.data.data))
      .catch(console.error)
      .finally(() => setSchoolsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await axiosClient.post("/follow-ups", {
        school_id: schoolId ? Number(schoolId) : null,
        follow_up_date: followUpDate,
        type,
        summary,
        next_action: nextAction || null,
      });
      router.push("/follow-ups");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Failed to create follow-up", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageBreadcrumb pageTitle="Log Follow-Up" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School / Lead */}
          <div>
            <Label>
              School / Lead <span className="text-error-500">*</span>
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
                  {schoolsLoading ? "Loading schools..." : "Select a school"}
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

          {/* Follow-Up Date */}
          <div>
            <Label>
              Follow-Up Date <span className="text-error-500">*</span>
            </Label>
            <Input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              error={!!errors.follow_up_date}
              hint={errors.follow_up_date?.[0]}
              disabled={loading}
            />
          </div>

          {/* Follow-Up Type */}
          <div>
            <Label>
              Type <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 ${
                  type ? "text-gray-800 dark:text-white/90" : "text-gray-400"
                } ${errors.type ? "border-error-500" : "border-gray-300"}`}
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Select follow-up type
                </option>
                {FOLLOW_UP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.type && (
              <p className="mt-1.5 text-xs text-error-500">{errors.type[0]}</p>
            )}
          </div>

          {/* Summary */}
          <div>
            <Label>
              Summary <span className="text-error-500">*</span>
            </Label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={loading}
              placeholder="What happened during this follow-up?"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-800 resize-none ${
                errors.summary ? "border-error-500" : "border-gray-300"
              }`}
            />
            {errors.summary && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.summary[0]}
              </p>
            )}
          </div>

          {/* Next Action */}
          <div>
            <Label>Next Action</Label>
            <textarea
              rows={2}
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              disabled={loading}
              placeholder="What is the next step? (optional)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-800 resize-none"
            />
            {errors.next_action && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.next_action[0]}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/follow-ups")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Log Follow-Up"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
