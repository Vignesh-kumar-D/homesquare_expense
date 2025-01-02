export interface ProjectAllocation {
  projectId: string;
  projectName: string;
  allocated: number;
  spent: number;
  lastTransaction: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  date: string;
  description: string;
  type: 'ALLOCATED' | 'SPENT';
}

export interface EmployeeFinancial {
  id: string;
  name: string;
  role: string;
  totalAllocated: number;
  totalSpent: number;
  spendingPercentage: number;
  projectAllocations: ProjectAllocation[];
  recentTransactions: Transaction[];
}
