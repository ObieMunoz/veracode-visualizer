export interface FindingFile {
  file: string;
  upload_file?: string;
  line: number;
  function_name: string;
  qualified_function_name?: string;
  function_prototype?: string;
  scope?: string;
}

export interface FindingFiles {
  source_file?: FindingFile;
}

export interface FlawMatch {
  procedure_hash?: string;
  prototype_hash?: string;
  flaw_hash?: string;
  flaw_hash_count?: number;
  flaw_hash_ordinal?: number;
  cause_hash?: string;
  cause_hash_count?: number;
  cause_hash_ordinal?: number;
  cause_hash2?: string;
  cause_hash2_ordinal?: string;
}

export interface StackDumpEntry {
  [key: string]: unknown;
}

export interface StackDumps {
  stack_dump?: StackDumpEntry[];
}

export interface Finding {
  title: string;
  issue_id: number;
  image_path?: string;
  gob?: string;
  severity: number;
  issue_type_id: string;
  issue_type: string;
  cwe_id: string;
  display_text: string;
  files?: FindingFiles;
  flaw_match?: FlawMatch;
  stack_dumps?: StackDumps;
  flaw_details_link?: string;
}

export interface ScanData {
  _links?: {
    root?: { href: string };
    self?: { href: string };
    help?: { href: string };
  };
  scan_id: string;
  scan_status: string;
  message: string;
  modules: string[];
  modules_count: number;
  findings: Finding[];
  selected_modules?: string[];
  pipeline_scan?: string;
  dev_stage?: string;
}

export interface SeverityInfo {
  text: string;
  badgeClass: string;
  chartColor: string;
}

export type SortableFindingKeys =
  | keyof Pick<Finding, "title" | "severity" | "issue_type" | "cwe_id">
  | "file"
  | "line";

export interface SortConfig {
  key: SortableFindingKeys;
  direction: "ascending" | "descending";
}
