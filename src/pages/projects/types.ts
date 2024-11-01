export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate?: string;
  totalBudget: number;
  spentAmount: number;
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
