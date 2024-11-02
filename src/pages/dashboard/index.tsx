import React from 'react';
import styles from './Dashboard.module.css';
import StatsCard from './components/StatsCard';
import SpendingChart from './components/SpendingChart';
import ProjectStatus from './components/ProjectStatus';
import TopProjects from './components/TopProjects';
import RecentTransactions from './components/RecentTransactions';
import EmployeeAllocations from './components/EmployeeAllocations';

const Dashboard: React.FC = () => {
  const stats = {
    totalBudget: 1500000,
    totalSpent: 650000,
    totalAllocated: 850000,
    activeProjects: 8,
    pendingTransactions: 5,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="Total Budget"
          value={stats.totalBudget}
          isCurrency
          trendValue={12}
          trendDirection="up"
        />
        <StatsCard
          title="Total Spent"
          value={stats.totalSpent}
          isCurrency
          trendValue={8}
          trendDirection="up"
        />
        <StatsCard
          title="Total Allocated"
          value={stats.totalAllocated}
          isCurrency
          trendValue={15}
          trendDirection="up"
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          trendValue={2}
          trendDirection="up"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingTransactions}
          trendValue={3}
          trendDirection="down"
        />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <div className={styles.mainChart}>
          <SpendingChart />
        </div>
        <div className={styles.pieChart}>
          <ProjectStatus />
        </div>
      </div>

      {/* Projects and Transactions */}
      <div className={styles.dataGrid}>
        <div className={styles.topProjects}>
          <TopProjects />
        </div>
        <div className={styles.recentTransactions}>
          <RecentTransactions />
        </div>
      </div>

      {/* Employee Allocations */}
      <div className={styles.employeeSection}>
        <EmployeeAllocations />
      </div>
    </div>
  );
};

export default Dashboard;
