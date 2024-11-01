export interface EmployeeFinancial {
  id: string;
  name: string;
  role: 'admin' | 'accountant' | 'employee';
  totalAllocated: number;
  totalSpent: number;
  spendingPercentage: number;
  projectAllocations: {
    projectId: string;
    projectName: string;
    allocated: number;
    spent: number;
    lastTransaction?: string; // date
  }[];
  recentTransactions: {
    id: string;
    projectId: string;
    projectName: string;
    amount: number;
    date: string;
    description: string;
  }[];
}
