import React from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MoreVertical,
  FileText,
  Share2,
  Download,
  Calendar,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import { DocumentItem } from '../../types';

export const HistoryView: React.FC = () => {
  const documents: DocumentItem[] = [
    {
      id: 'doc-101',
      title: 'Commercial Lease Agreement 2026.pdf',
      category: 'Contract',
      date: 'Nov 12, 2026 • 16:30',
      pages: 14,
      size: '8.4 MB',
      thumbnailColor: 'from-emerald-700 to-teal-800',
      status: 'Ready',
    },
    {
      id: 'doc-102',
      title: 'Tax Invoice INV-9841.pdf',
      category: 'Invoice',
      date: 'Nov 11, 2026 • 09:12',
      pages: 2,
      size: '1.1 MB',
      thumbnailColor: 'from-indigo-600 to-blue-800',
      status: 'Ready',
    },
    {
      id: 'doc-103',
      title: 'Driver License Front & Back.pdf',
      category: 'ID Card',
      date: 'Nov 10, 2026 • 14:05',
      pages: 2,
      size: '3.2 MB',
      thumbnailColor: 'from-amber-600 to-orange-700',
      status: 'Processed',
    },
    {
      id: 'doc-104',
      title: 'Flight Ticket & Boarding Pass.pdf',
      category: 'Receipt',
      date: 'Nov 09, 2026 • 21:40',
      pages: 1,
      size: '720 KB',
      thumbnailColor: 'from-purple-600 to-pink-700',
      status: 'Ready',
    },
    {
      id: 'doc-105',
      title: 'Meeting Whiteboard Notes.pdf',
      category: 'Note',
      date: 'Nov 07, 2026 • 11:20',
      pages: 5,
      size: '4.8 MB',
      thumbnailColor: 'from-slate-700 to-slate-800',
      status: 'Draft',
    },
    {
      id: 'doc-106',
      title: 'Equipment Maintenance Log.pdf',
      category: 'Other',
      date: 'Nov 05, 2026 • 15:10',
      pages: 3,
      size: '1.9 MB',
      thumbnailColor: 'from-blue-700 to-cyan-800',
      status: 'Ready',
    },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Search & Filter Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            readOnly
            placeholder="Search documents by title, OCR text, or tag..."
            className="w-full bg-surface-850 border border-surface-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 cursor-pointer"
          />
        </div>
        <button
          type="button"
          className="w-10 h-10 rounded-xl bg-surface-850 border border-surface-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-surface-700 transition touch-press"
          title="Filter documents"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Status Pills & Sorter */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="px-3 py-1 rounded-full bg-brand-600 text-white font-medium shadow-sm">
            All (6)
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-850 text-slate-400 border border-surface-800 hover:text-slate-200 cursor-pointer">
            PDFs (5)
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-850 text-slate-400 border border-surface-800 hover:text-slate-200 cursor-pointer">
            Drafts (1)
          </span>
        </div>

        <button
          type="button"
          className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 font-medium text-[11px]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Newest</span>
        </button>
      </div>

      {/* Document Archive List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-surface-850/80 border border-surface-800 hover:border-surface-700/80 rounded-2xl p-3.5 transition touch-press"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 min-w-0">
                {/* Visual Thumbnail */}
                <div
                  className={`w-12 h-15 rounded-xl bg-gradient-to-br ${doc.thumbnailColor} flex flex-col items-center justify-center shadow-md flex-shrink-0 relative`}
                >
                  <FileText className="w-6 h-6 text-white/95" />
                  <span className="text-[9px] font-bold text-white/90 mt-0.5">
                    {doc.pages} PGS
                  </span>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        doc.status === 'Ready'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : doc.status === 'Processed'
                          ? 'bg-indigo-500/10 text-brand-300 border border-brand-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {doc.status === 'Ready' && <CheckCircle2 className="w-2.5 h-2.5 mr-1" />}
                      {doc.status === 'Draft' && <Clock3 className="w-2.5 h-2.5 mr-1" />}
                      {doc.status}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-surface-800 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 truncate mt-1">
                    {doc.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1.5">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                      {doc.date}
                    </span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>

              {/* Actions menu */}
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-800 transition"
                title="Document actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Ribbon */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-800/80 text-xs">
              <span className="text-[11px] text-slate-500 font-mono">ID: {doc.id}</span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
                  title="Share document"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Share</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Export</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
