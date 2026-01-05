
import { SKU, ReportType, LabReport } from '../types';

// User provided OneDrive Folder Link
export const CLOUD_STORAGE_URL = "https://ganeshgrain-my.sharepoint.com/:f:/g/personal/packaging_development_ganeshconsumer_com/EvuA0WKL0SdAjTD6uJ6FIAQBJJpizkKoSOLPg65FXPdeFQ?e=6vaZPS";

// Initial Mock Data
export const INITIAL_SKUS: SKU[] = [
  {
    id: 'sku-001',
    name: 'Standard 1KG Laminate Pouch',
    type: ReportType.LAMINATE,
    laminateStandards: {
      pouchWidth: '150',
      pouchWidthTolerance: '+/- 2mm',
      pouchHeight: '220',
      pouchHeightTolerance: '+/- 2mm',
      gsm: '85',
      gsmTolerance: '+/- 5%',
      pouchWeight: '5.2',
      pouchWeightTolerance: '+/- 0.2g',
      rollWeight: '25 - 30',
      bondStrength: 'Min 1.5',
      sealStrength: 'Min 2.5',
      cof: '0.20 - 0.30',
      dartValue: 'Min 120',
      eyeMarkDimensions: '10x10mm',
    }
  },
  {
    id: 'sku-002',
    name: 'Premium 5KG Rice Bag',
    type: ReportType.LAMINATE,
    laminateStandards: {
      pouchWidth: '300',
      pouchWidthTolerance: '+/- 3mm',
      pouchHeight: '450',
      pouchHeightTolerance: '+/- 3mm',
      gsm: '110',
      gsmTolerance: '+/- 5%',
      pouchWeight: '12.5',
      pouchWeightTolerance: '+/- 0.5g',
      rollWeight: '30 - 35',
      bondStrength: 'Min 2.0',
      sealStrength: 'Min 3.0',
      cof: '0.30 - 0.40',
      dartValue: 'Min 150',
      eyeMarkDimensions: '15x15mm',
    }
  },
  {
    id: 'sku-sack-001',
    name: '25KG Woven Sack',
    type: ReportType.SACK,
    sackStandards: {
      sackWidth: '450',
      sackWidthTolerance: '+/- 10mm',
      sackHeight: '850',
      sackHeightTolerance: '+/- 10mm',
      sackWeight: '80',
      sackWeightTolerance: '+/- 5g',
      baleWeight: '500 KG'
    }
  }
];

// LocalStorage Keys
const SKUS_KEY = 'labguard_skus';
const REPORTS_KEY = 'labguard_reports';

export const StorageService = {
  getSKUs: (): SKU[] => {
    const stored = localStorage.getItem(SKUS_KEY);
    if (!stored) {
      localStorage.setItem(SKUS_KEY, JSON.stringify(INITIAL_SKUS));
      return INITIAL_SKUS;
    }
    return JSON.parse(stored);
  },

  saveSKU: (sku: SKU) => {
    const skus = StorageService.getSKUs();
    const existingIndex = skus.findIndex(s => s.id === sku.id);
    if (existingIndex >= 0) {
      skus[existingIndex] = sku;
    } else {
      skus.push(sku);
    }
    localStorage.setItem(SKUS_KEY, JSON.stringify(skus));
  },

  deleteSKU: (id: string) => {
    const skus = StorageService.getSKUs();
    const filtered = skus.filter(s => s.id !== id);
    localStorage.setItem(SKUS_KEY, JSON.stringify(filtered));
  },

  getReports: (): LabReport[] => {
    const stored = localStorage.getItem(REPORTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getReportById: (id: string): LabReport | undefined => {
    const reports = StorageService.getReports();
    return reports.find(r => r.id === id);
  },

  saveReport: (report: LabReport) => {
    const reports = StorageService.getReports();
    reports.push(report);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  },

  deleteReport: (id: string) => {
    const reports = StorageService.getReports();
    const filtered = reports.filter(r => r.id !== id);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));
  },

  exportDatabase: () => {
    const data = {
      skus: StorageService.getSKUs(),
      reports: StorageService.getReports(),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LabGuard_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
