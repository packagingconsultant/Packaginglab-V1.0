
export enum ReportType {
  LAMINATE = 'Laminate',
  SACK = 'Sack',
  MONO_CARTON = 'Mono Carton',
  TSHIRT = 'T-Shirt',
  CFC_BOX = 'CFC Box'
}

export interface LaminateStandards {
  // Dimensions & GSM (Keep Tolerance)
  pouchWidth: string; 
  pouchWidthTolerance: string;
  
  pouchHeight: string;
  pouchHeightTolerance: string;
  
  gsm: string;
  gsmTolerance: string;

  pouchWeight: string;
  pouchWeightTolerance: string;

  // No Separate Tolerance Fields (Merged into Standard as per request)
  rollWeight: string; // Range e.g. "25-30"
  bondStrength: string; // Min e.g. "Min 1.5"
  sealStrength: string; // Min e.g. "Min 2.5"
  cof: string; // Range e.g. "0.20 - 0.30"
  dartValue: string; // Min e.g. "Min 120"
  eyeMarkDimensions: string; // Fixed value
}

export interface SackStandards {
  sackWidth: string;
  sackWidthTolerance: string;
  
  sackHeight: string;
  sackHeightTolerance: string;

  sackWeight: string;
  sackWeightTolerance: string;

  baleWeight: string; // No tolerance required
}

export interface SKU {
  id: string;
  name: string; // e.g., "5kg Rice Bag" -> Maps to "Product"
  type: ReportType;
  // Specific standards based on type
  laminateStandards?: LaminateStandards; 
  sackStandards?: SackStandards;
}

export interface QCPoint {
  parameter: string;
  standard: string | number;
  tolerance?: string; 
  actual: string | number;
  status: 'Pass' | 'Fail' | 'NA' | ''; // Added '' for LEAVE BLANK
  isAutoCalculated?: boolean;
  options?: string[]; // For dropdown options
}

export interface ReportData {
  // General Info
  unit: string;
  vendor: string;
  invoiceNumber: string;
  rollsSupplied: string; 
  rollsSampled: string; 
  invoiceDate: string; 
  receivingDateUnit: string;
  receivingDateLab: string;
  reportingDate: string;
  
  // Specific Data (Laminate/Sack)
  qcPoints: QCPoint[];
  remarks: string;
  sackImage?: string;
  
  // Linked SKU
  skuName: string; // Maps to "Product"
  materialCode: string; // Manually entered in report
}

export interface LabReport {
  id: string;
  type: ReportType;
  invoiceNumber: string;
  invoiceDate: string;
  createdAt: string;
  createdBy: string;
  data: ReportData;
}

export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'User';
}