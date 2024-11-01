// src/pages/Employees/Employees.tsx
import React, { useState } from 'react';
import styles from './Employees.module.css';
import { EmployeeFinancial } from './types';

const Employees: React.FC = () => {
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

  const mockEmployees: EmployeeFinancial[] = [
    {
      id: '1',
      name: 'John Doe',
      role: 'employee',
      totalAllocated: 100000,
      totalSpent: 45000,
      spendingPercentage: 45,
      projectAllocations: [
        {
          projectId: '1',
          projectName: 'Website Redesign',
          allocated: 60000,
          spent: 25000,
          lastTransaction: '2024-01-15',
        },
        {
          projectId: '2',
          projectName: 'Mobile App',
          allocated: 40000,
          spent: 20000,
          lastTransaction: '2024-01-20',
        },
      ],
      recentTransactions: [
        {
          id: 't1',
          projectId: '1',
          projectName: 'Website Redesign',
          amount: 5000,
          date: '2024-01-15',
          description: 'UI Components',
        },
        // ... more transactions
      ],
    },
    // ... more employees
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return 'var(--color-success)';
    if (percentage < 75) return 'var(--color-warning)';
    if (percentage < 90) return 'var(--color-warning-dark)';
    return 'var(--color-error)';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Employee Allocations</h1>

      <div className={styles.employeeList}>
        {mockEmployees.map((employee) => (
          <div
            key={employee.id}
            className={`${styles.employeeCard} ${
              expandedEmployee === employee.id ? styles.expanded : ''
            }`}
          >
            <div
              className={styles.cardHeader}
              onClick={() =>
                setExpandedEmployee(
                  expandedEmployee === employee.id ? null : employee.id
                )
              }
            >
              <div className={styles.employeeInfo}>
                <h2 className={styles.employeeName}>{employee.name}</h2>
                <span className={styles.employeeRole}>{employee.role}</span>
              </div>

              <div className={styles.allocationInfo}>
                <div className={styles.amounts}>
                  <span className={styles.allocated}>
                    ${employee.totalAllocated.toLocaleString()}
                  </span>
                  <span className={styles.spent}>
                    ${employee.totalSpent.toLocaleString()}
                  </span>
                </div>

                <div className={styles.progressWrapper}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${employee.spendingPercentage}%`,
                        backgroundColor: getStatusColor(
                          employee.spendingPercentage
                        ),
                      }}
                    />
                  </div>
                  <span
                    className={styles.percentage}
                    style={{
                      color: getStatusColor(employee.spendingPercentage),
                    }}
                  >
                    {employee.spendingPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {expandedEmployee === employee.id && (
              <div className={styles.cardContent}>
                <div className={styles.projectAllocations}>
                  <h3 className={styles.sectionTitle}>Project Allocations</h3>
                  {employee.projectAllocations.map((project) => (
                    <div key={project.projectId} className={styles.projectRow}>
                      <div className={styles.projectInfo}>
                        <span className={styles.projectName}>
                          {project.projectName}
                        </span>
                        <span className={styles.lastTransaction}>
                          Last transaction: {project.lastTransaction}
                        </span>
                      </div>
                      <div className={styles.projectAmounts}>
                        <span className={styles.allocated}>
                          ${project.allocated.toLocaleString()}
                        </span>
                        <span className={styles.spent}>
                          ${project.spent.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.transactions}>
                  <h3 className={styles.sectionTitle}>Recent Transactions</h3>
                  {employee.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className={styles.transactionRow}>
                      <div className={styles.transactionInfo}>
                        <span className={styles.transactionProject}>
                          {transaction.projectName}
                        </span>
                        <span className={styles.transactionDescription}>
                          {transaction.description}
                        </span>
                      </div>
                      <div className={styles.transactionMeta}>
                        <span className={styles.transactionDate}>
                          {transaction.date}
                        </span>
                        <span className={styles.transactionAmount}>
                          ${transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
