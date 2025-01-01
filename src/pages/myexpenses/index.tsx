// src/pages/MyExpenses/MyExpenses.tsx
import React, { useCallback, useEffect, useState } from 'react';
import AddExpenseModal from './components/AddExpenseModal';
import ExpenseList from './components/ExpenseList';
import styles from './MyExpenses.module.css';
import { Expense } from '../../services/expense.service';
import { expenseService } from '../../services/expense.service';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const MyExpenses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchExpenses = useCallback(async () => {
    try {
      const data = await expenseService.getExpenses(user?.id ?? '0');
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
  const handleAddExpense = async (
    newExpense: Omit<Expense, 'id' | 'status' | 'userId'>
  ) => {
    try {
      setLoading(true);
      await expenseService.addExpense({
        ...newExpense,
        userId: user?.id ?? '0',
      });
      await fetchExpenses();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen text="Adding expense..." />;
  if (error) return <div className={styles.error}>{error}</div>;

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
