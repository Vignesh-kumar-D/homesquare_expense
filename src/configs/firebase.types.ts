import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'admin' | 'accountant' | 'employee';
  position: string;
  createdAt: Timestamp;
}

export interface Budget {
  id: string;
  departmentId: string;
  totalAmount: number;
  remainingAmount: number;
  fiscalYear: number;
  lastUpdated: Timestamp;
}
