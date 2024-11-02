// src/pages/MyExpenses/MyExpenses.tsx
import React, { useState } from 'react';
import AddExpenseModal from './components/AddExpenseModal';
import ExpenseList from './components/ExpenseList';
import styles from './MyExpenses.module.css';
import { Expense } from './types';

const MyExpenses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      projectId: 'p1',
      projectName: 'Website Redesign',
      amount: 5000,
      date: '2024-01-15',
      category: 'Software',
      description: 'UI Component Library License',
      status: 'approved',
    },
  ]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'status'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
      status: 'pending',
    };
    setExpenses((prev) => [expense, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Expenses</h1>
          <p className={styles.subtitle}>
            Track and manage your project expenses
          </p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Expense
        </button>
      </div>

      <ExpenseList expenses={expenses} />

      {isModalOpen && (
        <AddExpenseModal
          onSubmit={handleAddExpense}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyExpenses;
