export interface DashboardStats {
  totalBudget: number; // Sum of all projects' totalBudget
  totalSpent: number; // Sum of all employeeFunds' spentAmount
  totalAllocated: number; // Sum of all employeeFunds' allocatedAmount
  activeProjects: number; // Count of projects with status 'active'
  pendingTransactions: number; // Count of expenses with status 'pending'
}

export interface SpendingTrendData {
  month: string;
  budget: number; // Total budget for that month
  spent: number; // Total spent for that month
}

export interface ProjectStatusData {
  name: string; // 'Active', 'On Hold', 'Completed'
  value: number; // Count of projects in each status
}

export interface TopProjectData {
  id: string;
  name: string;
  budget: number; // Project's totalBudget
  spent: number; // Sum of related employeeFunds' spentAmount
  progress: number; // From Project progress
}

export interface RecentTransactionData {
  id: string;
  projectName: string;
  employeeName: string;
  amount: number;
  date: string;
  status: string;
}

export interface EmployeeAllocationData {
  id: string;
  name: string;
  allocated: number; // Sum of employee's allocatedAmount from employeeFunds
  spent: number; // Sum of employee's spentAmount from employeeFunds
  projectCount: number; // Count of unique projects in employeeFunds
}
