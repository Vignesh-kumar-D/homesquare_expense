export interface Transaction {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  type: 'ALLOCATED' | 'SPENT';
  status: 'pending' | 'approved' | 'rejected';
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Filters {
  dateRange: { startDate: string; endDate: string };
  employee: string;
  project: string;
  category: string;
  type: 'ALL' | 'ALLOCATED' | 'SPENT';
}
