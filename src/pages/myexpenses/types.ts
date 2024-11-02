export interface Expense {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
}
