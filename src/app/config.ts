import { ScanData } from "./types";

export const INITIAL_SCAN_DATA_STATE: ScanData = {
  scan_id: "",
  scan_status: "",
  message: "",
  modules: [],
  modules_count: 0,
  findings: [],
  dev_stage: "",
  pipeline_scan: "",
  selected_modules: [],
  _links: {},
};

export const ITEMS_PER_PAGE = 15;
