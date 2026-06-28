"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import axiosClient from "@/lib/axios";
import { ChevronDownIcon } from "@/icons";

export default function CreateSchoolPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [principalMobile, setPrincipalMobile] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const payload = {
      name,
      school_type: schoolType,
      city,
      address,
      principal_name: principalName || null,
      principal_mobile: principalMobile || null,
    };

    try {
      await axiosClient.post("/schools", payload);
      router.push("/schools");
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
      <PageBreadcrumb pageTitle="Create School" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>School Name <span className="text-error-500">*</span></Label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} error={!!errors.name} hint={errors.name?.[0]} disabled={loading} />
          </div>

          <div>
            <Label>School Type <span className="text-error-500">*</span></Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  schoolType ? "text-gray-800 dark:text-white/90" : "text-gray-400"
                }`}
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>Select School Type</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="international">International</option>
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.school_type && (
              <p className="mt-1.5 text-xs text-error-500">{errors.school_type[0]}</p>
            )}
          </div>

          <div>
            <Label>City <span className="text-error-500">*</span></Label>
            <Input type="text" value={city} onChange={(e) => setCity(e.target.value)} error={!!errors.city} hint={errors.city?.[0]} disabled={loading} />
          </div>

          <div>
            <Label>Address <span className="text-error-500">*</span></Label>
            <Input type="text" value={address} onChange={(e) => setAddress(e.target.value)} error={!!errors.address} hint={errors.address?.[0]} disabled={loading} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label>Principal Name</Label>
              <Input type="text" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} error={!!errors.principal_name} hint={errors.principal_name?.[0]} disabled={loading} />
            </div>
            <div>
              <Label>Principal Mobile</Label>
              <Input type="text" value={principalMobile} onChange={(e) => setPrincipalMobile(e.target.value)} error={!!errors.principal_mobile} hint={errors.principal_mobile?.[0]} disabled={loading} />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={() => router.push("/schools")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create School"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
