import { DocumentItem, ScanResult } from '../types';

const STORAGE_KEY = 'doc_scanner_documents_v1';
const API_KEY_STORAGE = 'doc_scanner_gemini_api_key';

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Q4 Financial Report 2026.pdf',
    category: 'Invoice',
    date: 'Today, 2:15 PM',
    pages: 4,
    size: '2.4 MB',
    thumbnailColor: 'from-blue-600 to-indigo-700',
    status: 'Ready',
    extractedText: `QUARTERLY FINANCIAL SUMMARY - Q4 2026
Document Ref: FIN-2026-Q4-098
Total Revenue: $1,420,500.00
Operational Expenses: $845,200.00
Net Margin: 40.5%
Status: Approved & Verified
All calculations audited in accordance with GAAP standards.`,
    confidence: 99.1,
  },
  {
    id: 'doc-2',
    title: 'Office Rental Agreement.pdf',
    category: 'Contract',
    date: 'Yesterday',
    pages: 8,
    size: '5.1 MB',
    thumbnailColor: 'from-emerald-600 to-teal-700',
    status: 'Ready',
    extractedText: `COMMERCIAL LEASE AGREEMENT
Landlord: Metro Commercial Properties Inc.
Tenant: Document Scanner Tech LLC
Premises: Suite 400, Innovation Tower
Term: 24 Months commencing December 1, 2026
Monthly Rent: $4,500.00
Security Deposit: $9,000.00`,
    confidence: 98.4,
  },
  {
    id: 'doc-3',
    title: 'Medical Health Card.pdf',
    category: 'ID Card',
    date: 'Nov 10, 2026',
    pages: 2,
    size: '1.2 MB',
    thumbnailColor: 'from-amber-600 to-orange-700',
    status: 'Processed',
    extractedText: `NATIONAL HEALTHCARE ID
Member Name: Johnathan Doe
Member ID: HC-99482-A
Group Number: G-88310
Issued: 01/2026 • Valid Thru: 01/2028
Emergency Contact: +1 (555) 019-2831`,
    confidence: 97.2,
  },
  {
    id: 'doc-4',
    title: 'Hardware Equipment Receipt.pdf',
    category: 'Receipt',
    date: 'Nov 08, 2026',
    pages: 1,
    size: '840 KB',
    thumbnailColor: 'from-purple-600 to-violet-700',
    status: 'Ready',
    extractedText: `TECH GEAR OUTLET STORE #42
Receipt #: REC-20261108-11
Date: 11/08/2026  14:32:10
1x Ultra-Wide 4K Monitor ........ $499.00
1x Ergonomic Keyboard .......... $129.99
Subtotal: $628.99
Tax (8.25%): $51.89
Total Paid: $680.88 (VISA *4921)`,
    confidence: 99.4,
  },
];

/**
 * Loads documents from local storage, falling back to initial data
 */
export function getSavedDocuments(): DocumentItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load documents from localStorage', err);
    return INITIAL_DOCUMENTS;
  }
}

/**
 * Saves a new scanned document to local storage
 */
export function saveScannedDocument(scan: ScanResult): DocumentItem {
  const existing = getSavedDocuments();

  const categoryColorMap: Record<string, string> = {
    Invoice: 'from-blue-600 to-indigo-700',
    Receipt: 'from-purple-600 to-violet-700',
    Contract: 'from-emerald-600 to-teal-700',
    'ID Card': 'from-amber-600 to-orange-700',
    Note: 'from-slate-700 to-slate-800',
    Other: 'from-cyan-600 to-blue-700',
  };

  const newDoc: DocumentItem = {
    id: scan.id,
    title: scan.title.endsWith('.pdf') ? scan.title : `${scan.title}.pdf`,
    category: scan.category,
    date: scan.date || 'Just now',
    pages: 1,
    size: scan.size,
    thumbnailColor: categoryColorMap[scan.category] || 'from-brand-600 to-indigo-700',
    status: 'Ready',
    extractedText: scan.extractedText,
    confidence: scan.confidence,
    previewUrl: scan.previewUrl,
    detectedFields: scan.detectedFields,
  };

  const updated = [newDoc, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist to localStorage', err);
  }

  return newDoc;
}

/**
 * Deletes a document by ID
 */
export function deleteSavedDocument(id: string): DocumentItem[] {
  const existing = getSavedDocuments();
  const updated = existing.filter((doc) => doc.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update localStorage', err);
  }
  return updated;
}

/**
 * Helper to get/set user Gemini API Key
 */
export function getGeminiApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) || (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY || '';
}

export function saveGeminiApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}
