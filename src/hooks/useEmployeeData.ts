import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../configs/firebase';
import { EmployeeFinancial } from '../pages/employees/types';
import { User } from '../configs/firebase.types';
import { EmployeeFund } from '../pages/projects/types';
import { Expense } from '../pages/myexpenses/types';

export const useEmployeeData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<EmployeeFinancial[]>([]);

  useEffect(() => {
    // In useEmployeeData.ts
    const fetchEmployeeData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get all users
        const usersSnapshot = await getDocs(query(collection(db, 'users')));

        const employeePromises = usersSnapshot.docs.map(async (userDoc) => {
          const user = userDoc.data() as User;

          // Get employee funds
          const fundsSnapshot = await getDocs(
            query(
              collection(db, 'employeeFunds'),
              where('employeeId', '==', userDoc.id)
            )
          );

          // Get employee expenses
          const expensesSnapshot = await getDocs(
            query(collection(db, 'expenses'), where('userId', '==', userDoc.id))
          );

          // Transform funds with project names
          const fundPromises = fundsSnapshot.docs.map(async (fundDoc) => {
            const fund = fundDoc.data() as EmployeeFund;
            // Get project details
            const projectDoc = await getDoc(
              doc(db, 'projects', fund.projectId)
            );
            const project = projectDoc.data();

            return {
              ...fund,
              id: fundDoc.id,
              projectName: project?.name || 'Unknown Project',
            };
          });

          const funds = await Promise.all(fundPromises);
          const expenses = expensesSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Expense[];

          // Calculate project allocations
          const projectAllocations = funds.map((fund) => ({
            projectId: fund.projectId,
            projectName: fund.projectName,
            allocated: fund.allocatedAmount,
            spent: fund.spentAmount,
            lastTransaction: fund.lastUpdated
              .toDate()
              .toISOString()
              .split('T')[0],
          }));

          // Calculate totals
          const totalAllocated = funds.reduce(
            (sum, fund) => sum + fund.allocatedAmount,
            0
          );
          const totalSpent = funds.reduce(
            (sum, fund) => sum + fund.spentAmount,
            0
          );
          const spendingPercentage =
            totalAllocated > 0
              ? Math.round((totalSpent / totalAllocated) * 100)
              : 0;

          // Get recent transactions
          const recentTransactions = [
            ...funds.map((fund) => ({
              id: fund.id,
              projectId: fund.projectId,
              projectName: fund.projectName,
              amount: fund.allocatedAmount,
              date: fund.lastUpdated.toDate().toISOString().split('T')[0],
              description: 'Fund Allocation',
              type: 'ALLOCATED' as const,
            })),
            ...expenses.map((expense) => ({
              id: expense.id,
              projectId: expense.projectId,
              projectName: expense.projectName,
              amount: expense.amount,
              date: expense.date,
              description: expense.description || '',
              type: 'SPENT' as const,
            })),
          ]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 8);

          return {
            id: userDoc.id,
            name: user.name,
            role: user.role,
            totalAllocated,
            totalSpent,
            spendingPercentage,
            projectAllocations,
            recentTransactions,
          };
        });

        const employeeData = await Promise.all(employeePromises);
        setEmployees(employeeData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, []);

  return { employees, loading, error };
};
