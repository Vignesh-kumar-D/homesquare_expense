// src/pages/Dashboard/components/RecentTransactions/RecentTransactions.tsx
import React from 'react';
import styles from './RecentTransactions.module.css';
import { RecentTransactionData } from '../types';

type Props = {
  transactions: RecentTransactionData[];
};
const RecentTransactions: React.FC<Props> = ({ transactions }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recent Transactions</h2>
      <div className={styles.transactionList}>
        {transactions.map((transaction) => (
          <div key={transaction.id} className={styles.transactionItem}>
            <div className={styles.transactionInfo}>
              <div className={styles.primary}>
                <span className={styles.projectName}>
                  {transaction.projectName}
                </span>
                <span className={styles.amount}>
                  ₹{transaction.amount.toLocaleString()}
                </span>
              </div>
              <div className={styles.secondary}>
                <span className={styles.employeeName}>
                  {transaction.employeeName}
                </span>
                <span className={styles.date}>
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className={`${styles.status} ${styles[transaction.status]}`}>
              {transaction.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
