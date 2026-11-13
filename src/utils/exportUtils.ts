import { jsPDF } from 'jspdf';
import { DocumentItem, FormattedDocumentData } from '../types';

type AnyDocument = DocumentItem | FormattedDocumentData;

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Document';
}

/**
 * Generates and downloads a clean, professional PDF document
 */
export async function exportAsPDF(
  doc: AnyDocument,
  options?: { customTitle?: string; includeSignature?: boolean }
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const title = options?.customTitle || doc.title.replace(/\.(pdf|docx|txt)$/i, '');
  const content = 'content' in doc ? doc.content : doc.extractedText || '';
  const dateStr = doc.date || new Date().toLocaleDateString();
  const category = doc.category || 'General Document';

  let currentY = margin;

  // --- Header ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(17, 24, 39); // Slate 900
  pdf.text(title, margin, currentY);
  currentY += 8;

  // Metadata line
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139); // Slate 500
  pdf.text(`${category}  •  ${dateStr}  •  Document Scanner Pro`, margin, currentY);
  currentY += 4;

  // Header Divider
  pdf.setDrawColor(226, 232, 240); // Slate 200
  pdf.setLineWidth(0.5);
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // --- Body Text ---
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59); // Slate 800

  const lines = pdf.splitTextToSize(content, contentWidth);
  const lineHeight = 6;

  for (let i = 0; i < lines.length; i++) {
    if (currentY + lineHeight > pageHeight - margin - 25) {
      // Add page when space runs out
      pdf.addPage();
      currentY = margin;
    }
    pdf.text(lines[i], margin, currentY);
    currentY += lineHeight;
  }

  // --- Digital Signature (if present) ---
  const includeSig = options?.includeSignature !== false;
  if (doc.signatureDataUrl && includeSig) {
    if (currentY + 35 > pageHeight - margin - 15) {
      pdf.addPage();
      currentY = margin;
    } else {
      currentY += 6;
    }

    // Signature Divider
    pdf.setDrawColor(203, 213, 225); // Slate 300
    pdf.setLineDashPattern([2, 2], 0);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    pdf.setLineDashPattern([], 0);
    currentY += 6;

    // Add signature image
    try {
      const sigWidth = 45;
      const sigHeight = 18;
      const sigX = pageWidth - margin - sigWidth;
      pdf.addImage(doc.signatureDataUrl, 'PNG', sigX, currentY, sigWidth, sigHeight);
      currentY += sigHeight + 2;

      // Signer label line
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text('Authorized Digital Signature', sigX, currentY);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text(doc.signedDate || dateStr, sigX, currentY + 4);
    } catch (err) {
      console.warn('Failed to render signature image into PDF:', err);
    }
  }

  // --- Footers on all pages ---
  const totalPages = pdf.internal.pages.length - 1;
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);

    // Footer divider
    pdf.setDrawColor(241, 245, 249);
    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    pdf.text(
      'Document Scanner • Official Document Export',
      margin,
      pageHeight - 8
    );
    pdf.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  pdf.save(`${sanitizeFilename(title)}.pdf`);
}

/**
 * Exports document as Microsoft Word compatible (.doc) file
 */
export function exportAsWordDoc(doc: AnyDocument, customTitle?: string): void {
  const title = customTitle || doc.title.replace(/\.(pdf|docx|txt)$/i, '');
  const content = 'content' in doc ? doc.content : doc.extractedText || '';
  const dateStr = doc.date || new Date().toLocaleDateString();

  const signatureHtml = doc.signatureDataUrl
    ? `
      <div style="margin-top: 40px; border-top: 1px dashed #cbd5e1; padding-top: 16px; display: flex; justify-content: flex-end;">
        <div style="text-align: center; width: 220px;">
          <img src="${doc.signatureDataUrl}" style="max-height: 55px; max-width: 200px;" alt="Signature" />
          <div style="border-top: 1px solid #111827; margin-top: 4px; padding-top: 4px; font-size: 9pt; color: #475569;">
            Authorized Signer • ${doc.signedDate || dateStr}
          </div>
        </div>
      </div>
    `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #0f172a;
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
        }
        .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 24px; }
        .title { font-size: 20pt; font-weight: bold; margin: 0; color: #0f172a; }
        .meta { font-size: 9pt; color: #64748b; margin-top: 6px; }
        .content { white-space: pre-wrap; margin-top: 20px; }
        .footer { border-top: 1px solid #e2e8f0; margin-top: 40px; padding-top: 12px; font-size: 8pt; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${title}</h1>
        <div class="meta">${doc.category} • ${dateStr} • Generated by Document Scanner</div>
      </div>
      <div class="content">${content}</div>
      ${signatureHtml}
      <div class="footer">Page 1 of 1 • Document Scanner Official Export</div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(title)}.doc`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports document as Plain Text (.txt) file
 */
export function exportAsPlainText(doc: AnyDocument, customTitle?: string): void {
  const title = customTitle || doc.title.replace(/\.(pdf|docx|txt)$/i, '');
  const content = 'content' in doc ? doc.content : doc.extractedText || '';
  const dateStr = doc.date || new Date().toLocaleDateString();

  const fullText = `DOCUMENT: ${title}
CATEGORY: ${doc.category}
DATE: ${dateStr}
SOURCE: Document Scanner
==================================================

${content}

==================================================
${doc.signatureDataUrl ? `[DIGITALLY SIGNED • ${doc.signedDate || dateStr}]` : ''}
End of Document
`;

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(title)}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports document as Markdown (.md) file
 */
export function exportAsMarkdown(doc: AnyDocument, customTitle?: string): void {
  const title = customTitle || doc.title.replace(/\.(pdf|docx|txt)$/i, '');
  const content = 'content' in doc ? doc.content : doc.extractedText || '';
  const dateStr = doc.date || new Date().toLocaleDateString();

  const mdText = `# ${title}

- **Category:** ${doc.category}
- **Date:** ${dateStr}
- **Generated by:** Document Scanner

---

${content}

${
  doc.signatureDataUrl
    ? `
---
> **Digitally Signed**  
> Authorized Signer • *${doc.signedDate || dateStr}*
`
    : ''
}
`;

  const blob = new Blob([mdText], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(title)}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports document as structured JSON (.json)
 */
export function exportAsJSON(doc: AnyDocument, customTitle?: string): void {
  const title = customTitle || doc.title.replace(/\.(pdf|docx|txt)$/i, '');
  const content = 'content' in doc ? doc.content : doc.extractedText || '';

  const exportPayload = {
    title,
    category: doc.category,
    date: doc.date,
    exportedAt: new Date().toISOString(),
    content,
    hasSignature: Boolean(doc.signatureDataUrl),
    signedDate: doc.signedDate || null,
    metadata: {
      generator: 'Document Scanner Pro',
      version: '1.0.0',
    },
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(title)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
