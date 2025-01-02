import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc as fireStoreDoc,
  QuerySnapshot,
  getDoc,
  QueryFieldFilterConstraint,
} from 'firebase/firestore';
import { db } from '../configs/firebase';
import { Filters, Transaction } from '../pages/transactions/types';
import { useEffect, useState } from 'react';
import { EmployeeFund, Project } from '../pages/projects/types';
import { Expense } from '../pages/myexpenses/types';
import { User } from '../configs/firebase.types';

interface FilterResult {
  filters: QueryFieldFilterConstraint[];
  skipQuery: boolean;
}

const transformExpenses = async (expensesSnapshot: QuerySnapshot) => {
  const transactions: Transaction[] = [];

  for (const doc of expensesSnapshot.docs) {
    const expense = doc.data() as Expense;

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
        const expenseFilters = buildExpenseFilters(filters);
        const allocationFilters = buildAllocationFilters(filters);

        let expenseTransactions: Transaction[] = [];
        let allocationTransactions: Transaction[] = [];

        // Always fetch both and filter afterwards
        const [expensesSnapshot, allocationsSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'expenses'), ...expenseFilters)),
          getDocs(query(collection(db, 'employeeFunds'), ...allocationFilters)),
        ]);

        // Transform the data
        const [transformedExpenses, transformedAllocations] = await Promise.all(
          [
            transformExpenses(expensesSnapshot),
            transformAllocations(allocationsSnapshot),
          ]
        );
        // Apply type and category filters after fetching
        if (filters.type === 'ALL') {
          expenseTransactions = transformedExpenses;
          allocationTransactions =
            filters.category === 'Fund Allocation'
              ? transformedAllocations
              : transformedAllocations.filter(
                  () => filters.category !== 'Fund Allocation'
                );
        } else if (filters.type === 'SPENT') {
          expenseTransactions = transformedExpenses;
        } else if (filters.type === 'ALLOCATED') {
          allocationTransactions = transformedAllocations;
        }

        let combinedTransactions = [
          ...expenseTransactions,
          ...allocationTransactions,
        ];

        // Apply search filter
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

        // Sort by date
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

const buildExpenseFilters = (
  filters: Filters
): QueryFieldFilterConstraint[] => {
  const queryFilters: QueryFieldFilterConstraint[] = [];

  // Date filtering for expenses
  if (filters.dateRange.startDate) {
    queryFilters.push(where('date', '>=', filters.dateRange.startDate));
  }

  if (filters.dateRange.endDate) {
    queryFilters.push(where('date', '<=', filters.dateRange.endDate));
  }

  // User/Employee filtering
  if (filters.employee) {
    queryFilters.push(where('userId', '==', filters.employee));
  }

  // Project filtering
  if (filters.project) {
    queryFilters.push(where('projectId', '==', filters.project));
  }

  // Category filtering
  if (filters.category && filters.category !== 'All') {
    queryFilters.push(where('category', '==', filters.category));
  }

  return queryFilters;
};

const buildAllocationFilters = (
  filters: Filters
): QueryFieldFilterConstraint[] => {
  const queryFilters: QueryFieldFilterConstraint[] = [];

  // Date filtering for allocations
  if (filters.dateRange.startDate) {
    queryFilters.push(
      where(
        'lastUpdated',
        '>=',
        Timestamp.fromDate(new Date(filters.dateRange.startDate))
      )
    );
  }

  if (filters.dateRange.endDate) {
    queryFilters.push(
      where(
        'lastUpdated',
        '<=',
        Timestamp.fromDate(new Date(filters.dateRange.endDate))
      )
    );
  }

  // Employee filtering
  if (filters.employee) {
    queryFilters.push(where('employeeId', '==', filters.employee));
  }

  // Project filtering
  if (filters.project) {
    queryFilters.push(where('projectId', '==', filters.project));
  }
  if (filters.category && filters.category !== 'All') {
    queryFilters.push(where('category', '==', filters.category));
  }
  return queryFilters;
};
