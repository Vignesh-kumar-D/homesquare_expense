// src/pages/transactions/components/TransactionGrid/TransactionGrid.tsx
import React from 'react';
import { useTransactions } from '../../../hooks/useTransaction';
import { Filters } from '../types';
import styles from './TransactionGrid.module.css';
import Alert from '../../../components/Alert';
import Loader from '../../../components/Loader';

interface TransactionGridProps {
  filters: Filters;
  searchTerm: string;
}

const TransactionGrid: React.FC<TransactionGridProps> = ({
  filters,
  searchTerm,
}) => {
  const { transactions, loading, error } = useTransactions(filters, searchTerm);

  if (loading) {
    return <Loader text="Loading Transactions" />;
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load transactions"
        description={
          error === 'PERMISSION_DENIED'
            ? 'You do not have permission to view these transactions.'
            : 'An error occurred while loading transactions. Please try again later.'
        }
      />
    );
  }

  if (!transactions.length) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <h3 className={styles.noResultsTitle}>No transactions found</h3>
        <p className={styles.noResultsText}>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {transactions.map((transaction) => (
        <div key={transaction.id} className={styles.transactionCard}>
          <div className={styles.transactionHeader}>
            <div className={styles.userFlow}>
              {transaction.type === 'ALLOCATED' ? (
                <>
                  <span className={styles.fromUser}>Admin</span>
                  <span className={styles.flowArrow}>→</span>
                  <span className={styles.toUser}>{transaction.userName}</span>
                </>
              ) : (
                <>
                  <span className={styles.fromUser}>
                    {transaction.userName}
                  </span>
                  <span className={styles.flowArrow}>→</span>
                  <span className={styles.toUser}>
                    {transaction.projectName}
                  </span>
                </>
              )}
            </div>
            <div
              className={`${styles.amount} ${
                transaction.type === 'ALLOCATED' ? styles.credit : styles.debit
              }`}
            >
              {transaction.type === 'ALLOCATED' ? '+' : '-'}₹
              {transaction.amount.toLocaleString()}
            </div>
          </div>

          <div className={styles.transactionDetails}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Project</span>
              <span className={styles.value}>{transaction.projectName}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Date</span>
              <span className={styles.value}>
                {new Date(transaction.date).toLocaleDateString()}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Category</span>
              <span className={styles.value}>{transaction.category}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Status</span>
              <span
                className={`${styles.status} ${styles[transaction.status]}`}
              >
                {transaction.status}
              </span>
            </div>

            {transaction.description && (
              <div className={styles.description}>
                {transaction.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionGrid;
