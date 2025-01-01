import { Timestamp } from 'firebase/firestore';

// src/types/firebase.ts
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'admin' | 'accountant' | 'employee';
  position: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  receiptUrls: string[];
  approvedBy?: string;
  approvedAt?: Timestamp;
}

export interface Budget {
  id: string;
  departmentId: string;
  totalAmount: number;
  remainingAmount: number;
  fiscalYear: number;
  lastUpdated: Timestamp;
}
