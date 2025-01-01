// src/pages/MyExpenses/components/ExpenseList/ExpenseList.tsx
import React from 'react';
import { Expense } from '../types';
import styles from './ExpenseList.module.css';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  return (
    <div className={styles.container}>
      {expenses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💸</div>
          <h3 className={styles.emptyTitle}>No expenses yet</h3>
          <p className={styles.emptyText}>
            Add your first expense using the button above
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {expenses.map((expense) => (
            <div key={expense.id} className={styles.expenseCard}>
              <div className={styles.cardHeader}>
                <div className={styles.project}>{expense.projectName}</div>
                <div className={styles.amount}>
                  ₹{expense?.amount?.toLocaleString()}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span className={styles.label}>Date</span>
                  <span className={styles.value}>
                    {new Date(expense?.date)?.toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.label}>Category</span>
                  <span className={styles.category}>{expense.category}</span>
                </div>

                {expense.description && (
                  <div className={styles.description}>
                    {expense.description}
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <div className={`${styles.status} ${styles[expense.status]}`}>
                  {expense.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
