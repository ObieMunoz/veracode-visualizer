import { Info } from "lucide-react";
import { ScanData } from "../types";

interface ScanOverviewProps {
  data: ScanData;
}

const ScanOverview: React.FC<ScanOverviewProps> = ({ data }) => {
  if (!data || !data.scan_id) return null;

  const statusColor = (): string => {
    if (data.scan_status === "SUCCESS") return "text-green-600 font-semibold";
    if (data.scan_status === "FAILURE" || data.scan_status === "ERROR")
      return "text-red-600 font-semibold";
    return "text-yellow-600 font-semibold";
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
        <Info size={24} className="mr-2 text-blue-500" /> Scan Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <strong>Scan ID:</strong>{" "}
          <span className="text-gray-600 break-all">{data.scan_id}</span>
        </div>
        <div>
          <strong>Status:</strong>{" "}
          <span className={statusColor()}>{data.scan_status}</span>
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <strong>Message:</strong>{" "}
          <span className="text-gray-600">{data.message}</span>
        </div>
        <div>
          <strong>Modules Count:</strong>{" "}
          <span className="text-gray-600">{data.modules_count}</span>
        </div>
        <div className="md:col-span-2">
          <strong>Modules:</strong>
          {data.modules && data.modules.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 mt-1">
              {data.modules.map((mod, idx) => (
                <li key={idx}>{mod}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-600"> N/A</span>
          )}
        </div>
        <div>
          <strong>Dev Stage:</strong>{" "}
          <span className="text-gray-600">{data.dev_stage || "N/A"}</span>
        </div>
        <div>
          <strong>Pipeline Scan Version:</strong>{" "}
          <span className="text-gray-600">{data.pipeline_scan || "N/A"}</span>
        </div>
        <div>
          <strong>Total Findings:</strong>{" "}
          <span className="text-gray-600">{data.findings?.length || 0}</span>
        </div>
      </div>
    </section>
  );
};

export default ScanOverview;
