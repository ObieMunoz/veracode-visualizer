import { SeverityInfo } from "../types";

export const getSeverityInfo = (severity: number): SeverityInfo => {
  switch (severity) {
    case 5:
      return {
        text: "Very High",
        badgeClass: "bg-red-100 text-red-800",
        chartColor: "rgba(239, 68, 68, 0.7)",
      };
    case 4:
      return {
        text: "High",
        badgeClass: "bg-orange-100 text-orange-800",
        chartColor: "rgba(249, 115, 22, 0.7)",
      };
    case 3:
      return {
        text: "Medium",
        badgeClass: "bg-yellow-100 text-yellow-800",
        chartColor: "rgba(234, 179, 8, 0.7)",
      };
    case 2:
      return {
        text: "Low",
        badgeClass: "bg-blue-100 text-blue-800",
        chartColor: "rgba(59, 130, 246, 0.7)",
      };
    case 1:
      return {
        text: "Very Low",
        badgeClass: "bg-green-100 text-green-800",
        chartColor: "rgba(34, 197, 94, 0.7)",
      };
    case 0:
      return {
        text: "Informational",
        badgeClass: "bg-gray-100 text-gray-800",
        chartColor: "rgba(156, 163, 175, 0.7)",
      };
    default:
      return {
        text: `Unknown (${severity})`,
        badgeClass: "bg-gray-200 text-gray-700",
        chartColor: "rgba(209, 213, 219, 0.7)",
      };
  }
};
