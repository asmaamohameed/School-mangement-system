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

interface Contact {
  id: number;
  name: string;
  position: string;
}

interface BookEntry {
  book_title: string;
  grade_level: string;
}

const INTEREST_LEVELS = ["Cold", "Warm", "Interested", "Highly Interested"];

export default function CreateVisitPage() {
  const router = useRouter();

  // Dropdowns data
  const [schools, setSchools] = useState<School[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Form fields
  const [schoolId, setSchoolId] = useState("");
  const [contactId, setContactId] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [interestLevel, setInterestLevel] = useState("");
  const [notes, setNotes] = useState("");

  // Books — dynamic list, backend requires at least 1
  const [books, setBooks] = useState<BookEntry[]>([
    { book_title: "", grade_level: "" },
  ]);

  // Submission state
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Fetch schools on mount
  useEffect(() => {
    axiosClient
      .get("/schools?per_page=100")
      .then((res) => setSchools(res.data.data))
      .catch(console.error)
      .finally(() => setSchoolsLoading(false));
  }, []);

  // Fetch contacts whenever school selection changes
  useEffect(() => {
    if (!schoolId) {
      setContacts([]);
      setContactId("");
      return;
    }
    setContactsLoading(true);
    setContactId("");
    axiosClient
      .get(`/contacts?school_id=${schoolId}&per_page=100`)
      .then((res) => setContacts(res.data.data))
      .catch(console.error)
      .finally(() => setContactsLoading(false));
  }, [schoolId]);

  // Book row handlers
  const updateBook = (
    index: number,
    field: keyof BookEntry,
    value: string
  ) => {
    setBooks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const addBook = () =>
    setBooks((prev) => [...prev, { book_title: "", grade_level: "" }]);

  const removeBook = (index: number) =>
    setBooks((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await axiosClient.post("/visits", {
        school_id: schoolId ? Number(schoolId) : null,
        contact_id: contactId ? Number(contactId) : null,
        visit_date: visitDate,
        interest_level: interestLevel,
        notes: notes || null,
        books,
      });
      router.push("/visits");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Failed to create visit", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageBreadcrumb pageTitle="Log Visit" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School */}
          <div>
            <Label>
              School <span className="text-error-500">*</span>
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

          {/* Contact Person — dynamically loaded based on selected school */}
          <div>
            <Label>
              Contact Person <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 ${
                  contactId
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400"
                } ${errors.contact_id ? "border-error-500" : "border-gray-300"}`}
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                disabled={loading || !schoolId || contactsLoading}
              >
                <option value="" disabled>
                  {!schoolId
                    ? "Select a school first"
                    : contactsLoading
                    ? "Loading contacts..."
                    : contacts.length === 0
                    ? "No contacts for this school"
                    : "Select a contact person"}
                </option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.position}
                  </option>
                ))}
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.contact_id && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.contact_id[0]}
              </p>
            )}
          </div>

          {/* Visit Date */}
          <div>
            <Label>
              Visit Date <span className="text-error-500">*</span>
            </Label>
            <Input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              error={!!errors.visit_date}
              hint={errors.visit_date?.[0]}
              disabled={loading}
            />
          </div>

          {/* Interest Level */}
          <div>
            <Label>
              Interest Level <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <select
                className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 ${
                  interestLevel
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400"
                } ${errors.interest_level ? "border-error-500" : "border-gray-300"}`}
                value={interestLevel}
                onChange={(e) => setInterestLevel(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Select interest level
                </option>
                {INTEREST_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.interest_level && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.interest_level[0]}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              placeholder="Optional visit notes..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-800 resize-none"
            />
            {errors.notes && (
              <p className="mt-1.5 text-xs text-error-500">{errors.notes[0]}</p>
            )}
          </div>

          {/* Books Presented — dynamic rows */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>
                Books Presented <span className="text-error-500">*</span>
              </Label>
              <button
                type="button"
                onClick={addBook}
                disabled={loading}
                className="text-xs text-brand-500 hover:text-brand-600 font-medium"
              >
                + Add Book
              </button>
            </div>

            {errors.books && (
              <p className="mb-2 text-xs text-error-500">{errors.books[0]}</p>
            )}

            <div className="space-y-3">
              {books.map((book, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start"
                >
                  <div>
                    <Input
                      type="text"
                      value={book.book_title}
                      onChange={(e) =>
                        updateBook(index, "book_title", e.target.value)
                      }
                      error={!!errors[`books.${index}.book_title`]}
                      hint={errors[`books.${index}.book_title`]?.[0]}
                      disabled={loading}
                    />
                    {/* placeholder via wrapper — show label only on first row */}
                    {index === 0 && (
                      <p className="mt-1 text-xs text-gray-400">Book Title</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      value={book.grade_level}
                      onChange={(e) =>
                        updateBook(index, "grade_level", e.target.value)
                      }
                      error={!!errors[`books.${index}.grade_level`]}
                      hint={errors[`books.${index}.grade_level`]?.[0]}
                      disabled={loading}
                    />
                    {index === 0 && (
                      <p className="mt-1 text-xs text-gray-400">Grade Level</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBook(index)}
                    disabled={books.length === 1 || loading}
                    className="mt-2 text-error-400 hover:text-error-600 disabled:opacity-30 text-lg leading-none"
                    title="Remove book"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/visits")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Log Visit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
