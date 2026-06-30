"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import {
  BoxCubeIcon,
  CalenderIcon,
  CheckCircleIcon,
  GroupIcon,
  PieChartIcon,
  ShootingStarIcon,
  TimeIcon,
} from "@/icons";

type DashboardType = "sales_rep" | "customer_service" | "management_admin";

interface SalesRepDashboard {
  dashboard_type: "sales_rep";
  visits_count: number;
  leads_count: number;
}

interface CustomerServiceDashboard {
  dashboard_type: "customer_service";
  pending_follow_ups: number;
}

interface ManagementAdminDashboard {
  dashboard_type: "management_admin";
  total_schools: number;
  total_leads: number;
  total_customers: number;
  conversion_rate: string;
}

type DashboardData =
  | SalesRepDashboard
  | CustomerServiceDashboard
  | ManagementAdminDashboard;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        {icon}
      </div>
      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
    </div>
  );
}

function getGridClass(dashboardType: DashboardType | null): string {
  switch (dashboardType) {
    case "sales_rep":
      return "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6";
    case "customer_service":
      return "grid grid-cols-1 gap-4 md:gap-6 max-w-md";
    case "management_admin":
      return "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6";
    default:
      return "grid grid-cols-1 gap-4 md:gap-6";
  }
}

export default function DashboardOverview() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get<DashboardData>("/dashboard");
        setDashboard(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
        {error ?? "No dashboard data available."}
      </div>
    );
  }

  const iconClassName = "size-6 text-gray-800 dark:text-white/90";

  return (
    <div className={getGridClass(dashboard.dashboard_type)}>
      {dashboard.dashboard_type === "sales_rep" && (
        <>
          <StatCard
            label="Visits Count"
            value={dashboard.visits_count}
            icon={<CalenderIcon className={iconClassName} />}
          />
          <StatCard
            label="Leads Count"
            value={dashboard.leads_count}
            icon={<ShootingStarIcon className={iconClassName} />}
          />
        </>
      )}

      {dashboard.dashboard_type === "customer_service" && (
        <StatCard
          label="Pending Follow-Ups"
          value={dashboard.pending_follow_ups}
          icon={<TimeIcon className={iconClassName} />}
        />
      )}

      {dashboard.dashboard_type === "management_admin" && (
        <>
          <StatCard
            label="Total Schools"
            value={dashboard.total_schools}
            icon={<BoxCubeIcon className={iconClassName} />}
          />
          <StatCard
            label="Total Leads"
            value={dashboard.total_leads}
            icon={<GroupIcon className={iconClassName} />}
          />
          <StatCard
            label="Total Customers"
            value={dashboard.total_customers}
            icon={<CheckCircleIcon className={iconClassName} />}
          />
          <StatCard
            label="Conversion Rate"
            value={dashboard.conversion_rate}
            icon={<PieChartIcon className={iconClassName} />}
          />
        </>
      )}
    </div>
  );
}
