import { useCallback, useRef, useState, ChangeEvent, DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { ScanData } from "../types";

interface DropZoneProps {
  onFileLoaded: (data: ScanData | null, name: string, error: boolean) => void;
  setGlobalError: (message: string) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  onFileLoaded,
  setGlobalError,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setGlobalError("");
      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            if (!e.target?.result) {
              throw new Error("File content is empty.");
            }
            const jsonData = JSON.parse(e.target.result as string) as ScanData; // Assert type
            if (
              !jsonData ||
              !jsonData.findings ||
              !Array.isArray(jsonData.findings)
            ) {
              setGlobalError(
                'Invalid JSON structure. "findings" array is missing or not an array.'
              );
              onFileLoaded(null, file.name, true);
              return;
            }
            onFileLoaded(jsonData, file.name, false);
          } catch (err) {
            setGlobalError(`Invalid JSON file: ${(err as Error).message}`);
            onFileLoaded(null, file.name, true);
          }
        };
        reader.onerror = () => {
          setGlobalError("Error reading file.");
          onFileLoaded(null, file.name, true);
        };
        reader.readAsText(file);
      } else {
        setGlobalError("Invalid file type. Please upload a JSON file.");
        onFileLoaded(null, file.name, true);
      }
    },
    [onFileLoaded, setGlobalError]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleFile(event.dataTransfer.files[0]);
        event.dataTransfer.clearData();
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFile(event.target.files[0]);
      // Reset file input to allow re-uploading the same file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                    ${
                      isDragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-400 bg-white hover:border-gray-500 hover:bg-gray-50"
                    }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <UploadCloud size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500">
        Drag & Drop JSON File Here or Click to Upload
      </p>
    </div>
  );
};

export default DropZone;
