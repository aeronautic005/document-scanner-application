export type NavigationTab = 'dashboard' | 'history' | 'settings';

export interface UploadedDocument {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  rawSize: number;
  type: string;
  previewUrl: string;
  uploadedAt: string;
  dimensions?: {
    width: number;
    height: number;
  };
  selectedCategory?: 'Receipt' | 'Invoice' | 'Contract' | 'ID Card' | 'Note' | 'Other';
}

export interface ScanResult {
  id: string;
  title: string;
  category: 'Receipt' | 'Invoice' | 'Contract' | 'ID Card' | 'Note' | 'Other';
  extractedText: string;
  confidence: number;
  wordCount: number;
  charCount: number;
  processingTimeMs: number;
  previewUrl: string;
  detectedFields?: { label: string; value: string }[];
  date: string;
  size: string;
  rawSize?: number;
}

export interface ScanProgress {
  status: 'idle' | 'preprocessing' | 'recognizing' | 'structuring' | 'completed' | 'error';
  progress: number; // 0 - 100
  message: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Receipt' | 'Invoice' | 'Contract' | 'ID Card' | 'Note' | 'Other';
  date: string;
  pages: number;
  size: string;
  thumbnailColor: string;
  status: 'Ready' | 'Processed' | 'Draft';
  extractedText?: string;
  confidence?: number;
  previewUrl?: string;
  detectedFields?: { label: string; value: string }[];
}

export interface QuickStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface CategorySummary {
  name: string;
  count: number;
  iconName: string;
}
