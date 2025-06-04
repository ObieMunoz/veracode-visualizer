import { useState, useEffect, useMemo, ChangeEvent } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Finding, SortConfig, SortableFindingKeys } from "../types";
import { getSeverityInfo } from "../utils/severityUtils";
import { ITEMS_PER_PAGE } from "../config";

interface FindingsTableProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
}

const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  onSelectFinding,
}) => {
  const [filterText, setFilterText] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "severity",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredFindings = useMemo(() => {
    if (!findings) return [];
    const sortableItems = [...findings];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let valA: string | number, valB: string | number;
        if (sortConfig.key === "file") {
          valA = a.files?.source_file?.file?.toLowerCase() || "";
          valB = b.files?.source_file?.file?.toLowerCase() || "";
        } else if (sortConfig.key === "line") {
          valA = parseInt(a.files?.source_file?.line?.toString() || "0") || 0;
          valB = parseInt(b.files?.source_file?.line?.toString() || "0") || 0;
        } else if (sortConfig.key === "severity") {
          valA = a.severity;
          valB = b.severity;
        } else if (sortConfig.key === "cwe_id") {
          valA = parseInt(a.cwe_id || "0") || 0;
          valB = parseInt(b.cwe_id || "0") || 0;
        } else {
          valA = (a[sortConfig.key as keyof Finding] || "")
            .toString()
            .toLowerCase();
          valB = (b[sortConfig.key as keyof Finding] || "")
            .toString()
            .toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems.filter(
      (finding) =>
        (finding.title?.toLowerCase() || "").includes(
          filterText.toLowerCase()
        ) ||
        (finding.issue_type?.toLowerCase() || "").includes(
          filterText.toLowerCase()
        ) ||
        (finding.cwe_id?.toString().toLowerCase() || "").includes(
          filterText.toLowerCase()
        ) ||
        (finding.files?.source_file?.file?.toLowerCase() || "").includes(
          filterText.toLowerCase()
        ) ||
        (getSeverityInfo(finding.severity)?.text.toLowerCase() || "").includes(
          filterText.toLowerCase()
        )
    );
  }, [findings, filterText, sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, findings]);

  const requestSort = (key: SortableFindingKeys) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const SortIcon: React.FC<{ columnKey: SortableFindingKeys }> = ({
    columnKey,
  }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const paginatedFindings = filteredFindings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredFindings.length / ITEMS_PER_PAGE);

  if (!findings)
    return <p className="text-gray-500 p-4">Loading findings data...</p>;

  const tableHeaders: { key: SortableFindingKeys; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "severity", label: "Severity" },
    { key: "issue_type", label: "Issue Type" },
    { key: "cwe_id", label: "CWE ID" },
    { key: "file", label: "File" },
    { key: "line", label: "Line" },
  ];

  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Detailed Findings
      </h2>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Filter findings..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterText}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilterText(e.target.value)
          }
        />
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {paginatedFindings.length} of {filteredFindings.length} findings
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort(header.key)}
                >
                  <div className="flex items-center">
                    {header.label} <SortIcon columnKey={header.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedFindings.length > 0 ? (
              paginatedFindings.map((finding, idx) => {
                const severityInfo = getSeverityInfo(finding.severity);
                return (
                  <tr
                    key={finding.issue_id?.toString() || idx}
                    className="hover:bg-gray-50"
                  >
                    <td
                      className="px-4 py-3 whitespace-nowrap max-w-xs truncate"
                      title={finding.title}
                    >
                      {finding.title || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${severityInfo.badgeClass}`}
                      >
                        {severityInfo.text}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 max-w-xs truncate"
                      title={finding.issue_type}
                    >
                      {finding.issue_type || "N/A"}
                    </td>
                    <td className="px-4 py-3">{finding.cwe_id || "N/A"}</td>
                    <td
                      className="px-4 py-3 whitespace-nowrap max-w-xs truncate"
                      title={finding.files?.source_file?.file}
                    >
                      {finding.files?.source_file?.file || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {finding.files?.source_file?.line || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onSelectFinding(finding)}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No findings match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {paginatedFindings.length > 0 ? (
          paginatedFindings.map((finding, idx) => {
            const severityInfo = getSeverityInfo(finding.severity);
            return (
              <div
                key={finding.issue_id?.toString() || idx}
                className="bg-white border rounded-lg p-4 shadow-sm hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {finding.title || "N/A"}
                  </h3>
                  <span
                    className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${severityInfo.badgeClass}`}
                  >
                    {severityInfo.text}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Issue Type:</span>
                    <span>{finding.issue_type || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">CWE ID:</span>
                    <span>{finding.cwe_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">File:</span>
                    <span
                      className="truncate max-w-[200px]"
                      title={finding.files?.source_file?.file}
                    >
                      {finding.files?.source_file?.file || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Line:</span>
                    <span>{finding.files?.source_file?.line || "N/A"}</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => onSelectFinding(finding)}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-xs px-3 py-1.5 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-gray-500">
            No findings match your criteria.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default FindingsTable;
