"use client";

import React, { useEffect, useState, useCallback } from "react";

interface ToastMessage {
  id: number;
  message: string;
}

/**
 * ForbiddenToast
 *
 * Listens for the custom `app:forbidden` DOM event dispatched by the global
 * Axios response interceptor whenever the API returns a 403 Forbidden status
 * (e.g. a Sales Rep trying to view/edit a school that does not belong to them).
 *
 * Mount this component once inside the root layout so it is always active.
 */
export default function ForbiddenToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: customEvent.detail.message }]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => dismiss(id), 5000);
    };

    window.addEventListener("app:forbidden", handler);
    return () => window.removeEventListener("app:forbidden", handler);
  }, [dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 shadow-lg dark:border-error-500/20 dark:bg-error-500/10 min-w-[280px] max-w-[360px]"
        >
          {/* Icon */}
          <span className="mt-0.5 shrink-0 text-error-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-error-700 dark:text-error-400">
              Access Denied
            </p>
            <p className="mt-0.5 text-xs text-error-600 dark:text-error-300">
              {toast.message}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 text-error-400 hover:text-error-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
