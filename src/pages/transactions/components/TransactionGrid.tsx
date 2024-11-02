// src/pages/Transactions/components/TransactionGrid/TransactionGrid.tsx
import React, { useMemo } from 'react';
import styles from './TransactionGrid.module.css';

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  fromUser: {
    id: string;
    name: string;
    role: 'admin' | 'employee';
  };
  toUser?: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
  amount: number;
  date: string;
  category?: string;
  description?: string;
}

interface TransactionGridProps {
  filters: {
    dateRange: { startDate: string; endDate: string };
    employee: string;
    project: string;
    category: string;
    type: 'ALL' | 'CREDIT' | 'DEBIT';
  };
  searchTerm: string;
}

const TransactionGrid: React.FC<TransactionGridProps> = ({
  filters,
  searchTerm,
}) => {
  // Mock data - replace with actual data fetching
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'CREDIT',
      fromUser: { id: 'admin1', name: 'Admin User', role: 'admin' },
      toUser: { id: 'emp1', name: 'John Doe' },
      project: { id: 'proj1', name: 'Website Redesign' },
      amount: 5000,
      date: '2024-01-15',
    },
    {
      id: '2',
      type: 'DEBIT',
      fromUser: { id: 'emp1', name: 'John Doe', role: 'employee' },
      project: { id: 'proj1', name: 'Website Redesign' },
      amount: 1000,
      date: '2024-01-16',
      category: 'Software',
      description: 'UI Components License',
    },
  ];
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Date Range Filter
      const transactionDate = new Date(transaction.date);
      const startDate = filters.dateRange.startDate
        ? new Date(filters.dateRange.startDate)
        : null;
      const endDate = filters.dateRange.endDate
        ? new Date(filters.dateRange.endDate)
        : null;

      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;

      // Employee Filter
      if (filters.employee && filters.employee !== '') {
        const isEmployeeMatch =
          transaction.fromUser.id === filters.employee ||
          transaction.toUser?.id === filters.employee;
        if (!isEmployeeMatch) return false;
      }

      // Project Filter
      if (filters.project && filters.project !== '') {
        if (transaction.project.id !== filters.project) return false;
      }

      // Category Filter
      if (filters.category && filters.category !== '') {
        if (transaction.category !== filters.category) return false;
      }

      // Transaction Type Filter
      if (filters.type !== 'ALL') {
        if (transaction.type !== filters.type) return false;
      }

      // Search Term Filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          transaction.fromUser.name.toLowerCase().includes(searchLower) ||
          transaction.toUser?.name.toLowerCase().includes(searchLower) ||
          transaction.project.name.toLowerCase().includes(searchLower) ||
          transaction.description?.toLowerCase().includes(searchLower) ||
          transaction.category?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [transactions, filters, searchTerm]);
  return (
    <div className={styles.container}>
      {filteredTransactions.length === 0 ? (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔍</div>
          <h3 className={styles.noResultsTitle}>No transactions found</h3>
          <p className={styles.noResultsText}>
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {transactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionCard}>
              <div className={styles.transactionHeader}>
                <div className={styles.userFlow}>
                  <span className={styles.fromUser}>
                    {transaction.fromUser.name}
                  </span>
                  <span className={styles.flowArrow}>→</span>
                  <span className={styles.toUser}>
                    {transaction.type === 'CREDIT'
                      ? transaction.toUser?.name
                      : transaction.project.name}
                  </span>
                </div>
                <div
                  className={`${styles.amount} ${
                    transaction.type === 'CREDIT' ? styles.credit : styles.debit
                  }`}
                >
                  {transaction.type === 'CREDIT' ? '+' : '-'}₹
                  {transaction.amount.toLocaleString()}
                </div>
              </div>

              <div className={styles.transactionDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Project</span>
                  <span className={styles.value}>
                    {transaction.project.name}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.label}>Date</span>
                  <span className={styles.value}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>

                {transaction.category && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Category</span>
                    <span className={styles.value}>{transaction.category}</span>
                  </div>
                )}

                {transaction.description && (
                  <div className={styles.description}>
                    {transaction.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionGrid;
