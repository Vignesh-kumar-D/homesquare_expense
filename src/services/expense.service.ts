// src/services/expense.service.ts
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../configs/firebase';
import { EmployeeFund } from '../pages/projects/types';

export interface Expense {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  date: string;
  category: string;
  userId: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const expenseService = {
  addExpense: async (expense: Omit<Expense, 'id' | 'status'>) => {
    return await runTransaction(db, async (transaction) => {
      // Get fund document
      const fundQuery = query(
        collection(db, 'employeeFunds'),
        where('employeeId', '==', expense.userId),
        where('projectId', '==', expense.projectId)
      );
      const fundSnapshot = await getDocs(fundQuery);
      const fundDoc = fundSnapshot.docs[0];
      const fund = fundDoc.data() as EmployeeFund;

      // Validate amount
      if (fund.remainingAmount < expense.amount) {
        throw new Error('Insufficient funds');
      }

      // Add expense
      const expenseRef = await addDoc(collection(db, 'expenses'), {
        ...expense,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      // Update fund
      transaction.update(doc(db, 'employeeFunds', fundDoc.id), {
        remainingAmount: fund.remainingAmount - expense.amount,
        spentAmount: fund.spentAmount + expense.amount,
      });

      return {
        id: expenseRef.id,
        ...expense,
        status: 'pending' as const,
      };
    });
  },
  getExpenses: async (userId: string) => {
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(expensesQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
  },
};
