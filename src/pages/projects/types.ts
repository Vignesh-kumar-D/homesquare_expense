import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate?: string;
  totalBudget: number;
  remainingBudget: number;
  status: 'active' | 'on-hold' | 'completed';
  progress: number;
}

export interface ProjectFormData {
  name: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate?: string;
  totalBudget: number;
  status: 'active' | 'on-hold' | 'completed';
}
export interface FormErrors {
  name?: string;
  clientName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalBudget?: string;
  status?: string;
}

export interface EmployeeFund {
  id: string;
  employeeId: string;
  projectId: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  lastUpdated: Timestamp;
}
