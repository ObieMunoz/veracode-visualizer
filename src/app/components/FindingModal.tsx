import { XCircle } from "lucide-react";
import { Finding } from "../types";
import { getSeverityInfo } from "../utils/severityUtils";

interface FindingModalProps {
  finding: Finding | null;
  onClose: () => void;
}

const FindingModal: React.FC<FindingModalProps> = ({ finding, onClose }) => {
  if (!finding) return null;

  const severityInfo = getSeverityInfo(finding.severity);
  const displayHTML = finding.display_text
    ? {
        __html: finding.display_text
          .replace(/\\u003c/g, "<")
          .replace(/\\u003e/g, ">"),
      }
    : { __html: "N/A" };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {finding.title || "Finding Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-700 overflow-y-auto pr-2">
          <p>
            <strong>Issue ID:</strong> {finding.issue_id || "N/A"}
          </p>
          <p>
            <strong>Severity:</strong>{" "}
            <span
              className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${severityInfo.badgeClass}`}
            >
              {severityInfo.text}
            </span>
          </p>
          <p>
            <strong>Issue Type:</strong> {finding.issue_type || "N/A"} (ID:{" "}
            {finding.issue_type_id || "N/A"})
          </p>
          <p>
            <strong>CWE ID:</strong>
            {finding.cwe_id ? (
              <a
                href={`https://cwe.mitre.org/data/definitions/${finding.cwe_id}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                {finding.cwe_id}
              </a>
            ) : (
              " N/A"
            )}
          </p>
          {finding.files?.source_file && (
            <>
              <p>
                <strong>File:</strong> {finding.files.source_file.file || "N/A"}
              </p>
              <p>
                <strong>Line:</strong> {finding.files.source_file.line || "N/A"}
              </p>
              <p>
                <strong>Function:</strong>{" "}
                {finding.files.source_file.function_name || "N/A"}
              </p>
              {finding.files.source_file.qualified_function_name &&
                finding.files.source_file.qualified_function_name !==
                  finding.files.source_file.function_name && (
                  <p>
                    <strong>Qualified Function:</strong>{" "}
                    {finding.files.source_file.qualified_function_name}
                  </p>
                )}
              <p>
                <strong>Function Prototype:</strong>{" "}
                <code className="text-xs bg-gray-100 p-1 rounded break-all">
                  {finding.files.source_file.function_prototype || "N/A"}
                </code>
              </p>
            </>
          )}
          <div className="mt-3 pt-3 border-t">
            <strong>Description:</strong>
            <div
              className="mt-1 p-2 bg-gray-50 rounded-md max-h-60 overflow-y-auto prose prose-sm"
              dangerouslySetInnerHTML={displayHTML}
            />
          </div>
          {finding.flaw_details_link && (
            <p className="mt-2">
              <strong>More Info:</strong>
              <a
                href={finding.flaw_details_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                Veracode Flaw Details
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindingModal;
