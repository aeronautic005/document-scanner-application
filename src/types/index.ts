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

export type DocumentFont = 'sans' | 'serif' | 'mono';
export type DocumentAlign = 'left' | 'center' | 'right' | 'justify';
export type DocumentPaperSize = 'a4' | 'letter' | 'legal';
export type DocumentSpacing = 'normal' | 'relaxed' | 'loose';

export interface DocumentFormattingOptions {
  fontFamily: DocumentFont;
  fontSize: number;
  lineSpacing: DocumentSpacing;
  alignment: DocumentAlign;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  paperSize: DocumentPaperSize;
  paperTheme: 'classic' | 'warm' | 'dark';
  headerTitle: string;
  authorOrOrg: string;
  includeHeader: boolean;
  includeFooter: boolean;
  includeDate: boolean;
}

export interface FormattedDocumentData {
  id: string;
  title: string;
  category: 'Receipt' | 'Invoice' | 'Contract' | 'ID Card' | 'Note' | 'Other';
  date: string;
  content: string;
  formatting: DocumentFormattingOptions;
  previewUrl?: string;
  sourceScanId?: string;
  wordCount: number;
  signatureDataUrl?: string;
  signedDate?: string;
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
  isFormattedDocument?: boolean;
  formatting?: DocumentFormattingOptions;
  formattedContent?: string;
  signatureDataUrl?: string;
  signedDate?: string;
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
