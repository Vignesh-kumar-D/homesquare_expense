// src/hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { Project, EmployeeFund } from '../pages/projects/types';
import { User } from '../configs/firebase.types';
import { Expense } from '../pages/myexpenses/types';
import {
  DashboardStats,
  SpendingTrendData,
  ProjectStatusData,
  TopProjectData,
  RecentTransactionData,
  EmployeeAllocationData,
} from '../pages/dashboard/types';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [spendingTrend, setSpendingTrend] = useState<SpendingTrendData[]>([]);
  const [projectStatus, setProjectStatus] = useState<ProjectStatusData[]>([]);
  const [topProjects, setTopProjects] = useState<TopProjectData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransactionData[]
  >([]);
  const [employeeAllocations, setEmployeeAllocations] = useState<
    EmployeeAllocationData[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all required data
        const [
          projectsSnapshot,
          fundsSnapshot,
          expensesSnapshot,
          usersSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'employeeFunds')),
          getDocs(collection(db, 'expenses')),
          getDocs(collection(db, 'users')),
        ]);

        const projects = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        const funds = fundsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EmployeeFund[];

        const expenses = expensesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];

        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        // Calculate Dashboard Stats
        const dashboardStats: DashboardStats = {
          totalBudget: projects.reduce(
            (sum, proj) => sum + proj.totalBudget,
            0
          ),
          totalSpent: funds.reduce((sum, fund) => sum + fund.spentAmount, 0),
          totalAllocated: funds.reduce(
            (sum, fund) => sum + fund.allocatedAmount,
            0
          ),
          activeProjects: projects.filter((p) => p.status === 'active').length,
          pendingTransactions: expenses.filter((e) => e.status === 'pending')
            .length,
        };

        // Calculate Project Status Distribution
        const statusData: ProjectStatusData[] = [
          {
            name: 'Active',
            value: projects.filter((p) => p.status === 'active').length,
          },
          {
            name: 'On Hold',
            value: projects.filter((p) => p.status === 'on-hold').length,
          },
          {
            name: 'Completed',
            value: projects.filter((p) => p.status === 'completed').length,
          },
        ];

        // Calculate Top Projects
        const projectSpending = projects.map((project) => {
          const projectFunds = funds.filter((f) => f.projectId === project.id);
          const spent = projectFunds.reduce(
            (sum, fund) => sum + fund.spentAmount,
            0
          );

          return {
            id: project.id,
            name: project.name,
            budget: project.totalBudget,
            spent,
            progress: project.progress,
          };
        });

        const topProjectsData = projectSpending
          .sort((a, b) => b.spent - a.spent)
          .slice(0, 5);

        // Get Recent Transactions
        const recentTransactionsData = await Promise.all(
          expenses
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 8)
            .map(async (expense) => {
              const user = users.find((u) => u.id === expense.userId);

              return {
                id: expense.id,
                projectName: expense.projectName,
                employeeName: user?.name || 'Unknown Employee',
                amount: expense.amount,
                date: expense.date,
                status: expense.status,
              };
            })
        );

        // Calculate Employee Allocations
        const employeeAllocationsData = users.map((user) => {
          const employeeFunds = funds.filter((f) => f.employeeId === user.id);
          const projectIds = new Set(employeeFunds.map((f) => f.projectId));

          return {
            id: user.id,
            name: user.name,
            allocated: employeeFunds.reduce(
              (sum, fund) => sum + fund.allocatedAmount,
              0
            ),
            spent: employeeFunds.reduce(
              (sum, fund) => sum + fund.spentAmount,
              0
            ),
            projectCount: projectIds.size,
          };
        });

        // Calculate Spending Trend (Last 6 months)
        const months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toISOString().slice(0, 7); // YYYY-MM format
        }).reverse();

        const spendingTrendData = months.map((month) => {
          const monthExpenses = expenses.filter((e) =>
            e.date.startsWith(month)
          );
          const spent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          const relevantProjects = new Set(
            monthExpenses.map((e) => e.projectId)
          );
          const budget = Array.from(relevantProjects).reduce((sum, projId) => {
            const project = projects.find((p) => p.id === projId);
            return sum + (project?.totalBudget || 0) / 12; // Divide annual budget by 12 for monthly
          }, 0);

          return {
            month: new Date(month).toLocaleString('default', {
              month: 'short',
            }),
            budget,
            spent,
          };
        });

        // Set all states
        setStats(dashboardStats);
        setSpendingTrend(spendingTrendData);
        setProjectStatus(statusData);
        setTopProjects(topProjectsData);
        setRecentTransactions(recentTransactionsData);
        setEmployeeAllocations(employeeAllocationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    loading,
    error,
    stats,
    spendingTrend,
    projectStatus,
    topProjects,
    recentTransactions,
    employeeAllocations,
  };
};
