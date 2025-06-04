"use client";

import React, { useState, useEffect } from "react";
import { FileJson, AlertCircle } from "lucide-react";
import { ScanData, Finding } from "./types";
import { INITIAL_SCAN_DATA_STATE } from "./config";
import ScanOverview from "./components/ScanOverview";
import SeverityChart from "./components/SeverityChart";
import IssueTypeChart from "./components/IssueTypeChart";
import FindingsTable from "./components/FindingsTable";
import FindingModal from "./components/FindingModal";
import DropZone from "./components/DropZone";

const App: React.FC = () => {
  const [scanData, setScanData] = useState<ScanData>(INITIAL_SCAN_DATA_STATE);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isFileError, setIsFileError] = useState<boolean>(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const handleFileLoaded = (
    data: ScanData | null,
    name: string,
    fileLoadError: boolean
  ) => {
    setFileName(name);
    setIsFileError(fileLoadError);
    if (data && !fileLoadError) {
      setScanData(data);
      setError("");
    } else {
      setScanData(INITIAL_SCAN_DATA_STATE);
    }
  };

  const setGlobalError = (errorMessage: string) => {
    setError(errorMessage);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedFinding(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-inter">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <FileJson size={40} className="text-blue-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Veracode Scan Visualizer
            </h1>
          </div>
          <p className="text-gray-600 mt-1">
            Upload and visualize your Veracode JSON scan results.
          </p>
        </header>

        <DropZone
          onFileLoaded={handleFileLoaded}
          setGlobalError={setGlobalError}
        />

        {fileName && (
          <p
            className={`text-sm mt-2 text-center ${
              isFileError ? "text-red-600" : "text-green-600"
            }`}
          >
            {isFileError
              ? `Error processing file: ${fileName}`
              : `Successfully loaded: ${fileName}`}
          </p>
        )}

        {error && (
          <div
            className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-start"
            role="alert"
          >
            <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        {scanData && scanData.scan_id && !error && (
          <div className="mt-8 space-y-8">
            <ScanOverview data={scanData} />
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SeverityChart findings={scanData.findings} />
              <IssueTypeChart findings={scanData.findings} />
            </section>
            <FindingsTable
              findings={scanData.findings}
              onSelectFinding={setSelectedFinding}
            />
          </div>
        )}

        {selectedFinding && (
          <FindingModal
            finding={selectedFinding}
            onClose={() => setSelectedFinding(null)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
