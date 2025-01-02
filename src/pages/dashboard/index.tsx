// src/pages/Dashboard/Dashboard.tsx
import React from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import Alert from '../../components/Alert';
import styles from './Dashboard.module.css';
import StatsCard from './components/StatsCard';
import SpendingChart from './components/SpendingChart';
import ProjectStatus from './components/ProjectStatus';
import TopProjects from './components/TopProjects';
import RecentTransactions from './components/RecentTransactions';
import EmployeeAllocations from './components/EmployeeAllocations';
import Loader from '../../components/Loader';

const Dashboard: React.FC = () => {
  const {
    loading,
    error,
    stats,
    spendingTrend,
    projectStatus,
    topProjects,
    recentTransactions,
    employeeAllocations,
  } = useDashboardData();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!stats) {
    return <Alert type="info" message="No dashboard data available" />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <StatsCard title="Total Budget" value={stats.totalBudget} isCurrency />
        <StatsCard title="Total Spent" value={stats.totalSpent} isCurrency />
        <StatsCard
          title="Total Allocated"
          value={stats.totalAllocated}
          isCurrency
        />
        <StatsCard title="Active Projects" value={stats.activeProjects} />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingTransactions}
        />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <div className={styles.mainChart}>
          <SpendingChart data={spendingTrend} />
        </div>
        <div className={styles.pieChart}>
          <ProjectStatus data={projectStatus} />
        </div>
      </div>

      {/* Projects and Transactions */}
      <div className={styles.dataGrid}>
        <div className={styles.topProjects}>
          <TopProjects topProjects={topProjects} />
        </div>
        <div className={styles.recentTransactions}>
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>

      {/* Employee Allocations */}
      <div className={styles.employeeSection}>
        <EmployeeAllocations data={employeeAllocations} />
      </div>
    </div>
  );
};

export default Dashboard;
