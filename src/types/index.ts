export type NavigationTab = 'dashboard' | 'history' | 'settings';

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Receipt' | 'Invoice' | 'Contract' | 'ID Card' | 'Note' | 'Other';
  date: string;
  pages: number;
  size: string;
  thumbnailColor: string;
  status: 'Ready' | 'Processed' | 'Draft';
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
