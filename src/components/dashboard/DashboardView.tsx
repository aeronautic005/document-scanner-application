import React from 'react';
import {
  Camera,
  Layers,
  ImageUp,
  FileText,
  FileCheck2,
  HardDrive,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { DocumentItem } from '../../types';

export const DashboardView: React.FC = () => {
  // Foundational mock data for UI visualization
  const quickStats = [
    { label: 'Scanned Docs', value: '42', change: '+8 this week', icon: FileCheck2 },
    { label: 'Storage Used', value: '28.4 MB', change: 'Cloud synced', icon: HardDrive },
    { label: 'OCR Ready', value: '39', change: '93% indexed', icon: Sparkles },
  ];

  const recentDocuments: DocumentItem[] = [
    {
      id: 'doc-1',
      title: 'Q4 Financial Report 2026.pdf',
      category: 'Invoice',
      date: 'Today, 2:15 PM',
      pages: 4,
      size: '2.4 MB',
      thumbnailColor: 'from-blue-600 to-indigo-700',
      status: 'Ready',
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
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome & Quick Action Card */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900/70 via-surface-850 to-surface-900 p-5 border border-brand-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
              Scanner Engine Idle
            </span>
            <span className="text-xs text-slate-400 font-medium">A4 / Auto-Detect</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            Ready to Capture
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xs">
            High-definition edge detection, automated perspective correction, and smart OCR.
          </p>

          {/* Action Trigger Buttons (Foundational Layout) */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <button
              type="button"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md shadow-brand-600/30 transition touch-press"
            >
              <Camera className="w-5 h-5 mb-1.5" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 text-slate-200 font-medium text-xs transition touch-press"
            >
              <Layers className="w-5 h-5 mb-1.5 text-brand-400" />
              <span>Batch Scan</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-800 hover:bg-surface-700 border border-surface-700 text-slate-200 font-medium text-xs transition touch-press"
            >
              <ImageUp className="w-5 h-5 mb-1.5 text-slate-300" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </section>

      {/* Productivity Stats Grid */}
      <section className="grid grid-cols-3 gap-3">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-surface-850/80 border border-surface-800 p-3.5 rounded-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <Icon className="w-4 h-4 text-brand-400" />
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-100 block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block truncate">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Category Filter Pills */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-semibold text-slate-200">Categories</h3>
          <span className="text-xs text-brand-400 hover:underline cursor-pointer">
            View all
          </span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['All Documents', 'Invoices', 'Receipts', 'Contracts', 'IDs', 'Certificates'].map((cat, i) => (
            <span
              key={cat}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer transition ${
                i === 0
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-800 text-slate-300 hover:bg-surface-700 border border-surface-700/60'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Recent Scans Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-200">Recent Scans</h3>
          </div>
          <span className="text-xs text-slate-400">4 items</span>
        </div>

        <div className="space-y-2.5">
          {recentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="group bg-surface-850/90 border border-surface-800 hover:border-surface-700 rounded-xl p-3 flex items-center justify-between transition touch-press"
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Visual Document Thumbnail placeholder */}
                <div
                  className={`w-11 h-13 rounded-lg bg-gradient-to-br ${doc.thumbnailColor} flex items-center justify-center shadow-inner flex-shrink-0 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-30" />
                  <FileText className="w-5 h-5 text-white/90" />
                  <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white/80 bg-black/40 px-1 rounded">
                    {doc.pages}p
                  </span>
                </div>

                {/* Document Information */}
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-brand-300 transition">
                    {doc.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800 text-slate-300 border border-surface-700">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{doc.date}</span>
                    <span className="text-[11px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400">{doc.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 pl-2">
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-800 transition"
                  title="View details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
