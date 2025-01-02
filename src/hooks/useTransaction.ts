import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc as fireStoreDoc,
  QuerySnapshot,
  getDoc,
} from 'firebase/firestore';
import { db } from '../configs/firebase';
import { Filters, Transaction } from '../pages/transactions/types';
import { useEffect, useState } from 'react';
import { EmployeeFund, Project } from '../pages/projects/types';
import { Expense } from '../pages/myexpenses/types';
import { User } from '../configs/firebase.types';

const transformExpenses = async (expensesSnapshot: QuerySnapshot) => {
  const transactions: Transaction[] = [];

  for (const doc of expensesSnapshot.docs) {
    const expense = doc.data() as Expense;

    // Get employee name from the User collection
    const employeeDoc = await getDoc(fireStoreDoc(db, 'users', expense.userId));
    const employee = employeeDoc.data() as User;

    transactions.push({
      id: doc.id,
      projectId: expense.projectId,
      projectName: expense.projectName,
      userId: expense.userId,
      userName: employee.name,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      type: 'SPENT',
      status: expense.status,
    });
  }

  return transactions;
};

const transformAllocations = async (allocationsSnapshot: QuerySnapshot) => {
  const transactions: Transaction[] = [];

  for (const doc of allocationsSnapshot.docs) {
    const allocation = doc.data() as EmployeeFund;

    // Get related data from Project and User collections
    const [projectDoc, employeeDoc] = await Promise.all([
      getDoc(fireStoreDoc(db, 'projects', allocation.projectId)),
      getDoc(fireStoreDoc(db, 'users', allocation.employeeId)),
    ]);

    const project = projectDoc.data() as Project;
    const employee = employeeDoc.data() as User;

    transactions.push({
      id: doc.id,
      projectId: allocation.projectId,
      projectName: project.name,
      userId: allocation.employeeId,
      userName: employee.name,
      amount: allocation.allocatedAmount,
      date: allocation.lastUpdated.toDate().toISOString(), // Convert Firestore Timestamp to string
      category: 'Fund Allocation', // Default category for allocations
      description: `Fund allocation for ${project.name}`,
      type: 'ALLOCATED',
      status: 'approved', // Allocations are always approved
    });
  }
  return transactions;
};
export const useTransactions = (filters: Filters, searchTerm: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch expenses (ALLOCATED transactions)
        const expensesQuery = query(
          collection(db, 'expenses'),
          ...buildExpenseFilters(filters)
        );

        // Fetch allocations (SPENT transactions)
        const allocationsQuery = query(
          collection(db, 'employeeFunds'),
          ...buildAllocationFilters(filters)
        );

        const [expensesSnapshot, allocationsSnapshot] = await Promise.all([
          getDocs(expensesQuery),
          getDocs(allocationsQuery),
        ]);

        const expenseTransactions = await transformExpenses(expensesSnapshot);
        const allocationTransactions = await transformAllocations(
          allocationsSnapshot
        );

        let combinedTransactions = [
          ...expenseTransactions,
          ...allocationTransactions,
        ];

        if (searchTerm) {
          combinedTransactions = combinedTransactions.filter(
            (transaction) =>
              transaction.projectName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              transaction.userName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              transaction.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        }

        combinedTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(combinedTransactions);
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        if (error.code === 'permission-denied') {
          setError('PERMISSION_DENIED');
        } else {
          setError('FETCH_ERROR');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters, searchTerm]);

  return { transactions, loading, error };
};

const buildExpenseFilters = (filters: Filters) => {
  const queryFilters = [];

  if (filters.dateRange.startDate && filters.dateRange.endDate) {
    queryFilters.push(
      where('date', '>=', filters.dateRange.startDate),
      where('date', '<=', filters.dateRange.endDate)
    );
  }

  if (filters.project) {
    queryFilters.push(where('projectId', '==', filters.project));
  }

  if (filters.category) {
    queryFilters.push(where('category', '==', filters.category));
  }

  return queryFilters;
};

const buildAllocationFilters = (filters: Filters) => {
  const queryFilters = [];

  if (filters.dateRange.startDate && filters.dateRange.endDate) {
    queryFilters.push(
      where(
        'lastUpdated',
        '>=',
        Timestamp.fromDate(new Date(filters.dateRange.startDate))
      ),
      where(
        'lastUpdated',
        '<=',
        Timestamp.fromDate(new Date(filters.dateRange.endDate))
      )
    );
  }

  if (filters.project) {
    queryFilters.push(where('projectId', '==', filters.project));
  }

  if (filters.employee) {
    queryFilters.push(where('employeeId', '==', filters.employee));
  }

  return queryFilters;
};
