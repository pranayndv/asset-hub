export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface RequestsSummary {
  pending: number;
  approved: number;
  rejected: number;
  returnRequested: number;
  closed: number;
}

export interface AssetSummary {
  total: number;
  available: number;
  checkedOut: number;
  inMaintenance: number;
  lost: number;
  retired: number;
}

interface BaseAnalytics {
  userRole: UserRole;
}

export interface AdminAnalytics extends BaseAnalytics {
  userRole: "ADMIN";
  managers: number;
  employees: number;
  assets: AssetSummary;
  requests: RequestsSummary;
}

export interface ManagerAnalytics extends BaseAnalytics {
  userRole: "MANAGER";
  teamEmployees: number;
  activeAssets: number;
  requests: RequestsSummary;
}

export type DashboardAnalyticsData = AdminAnalytics | ManagerAnalytics;

export interface AnalyticsApiResponse {
  success: boolean;
  data: DashboardAnalyticsData | null;
}
