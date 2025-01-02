// src/pages/Dashboard/components/EmployeeAllocations/EmployeeAllocations.tsx
import React from 'react';
import styles from './EmployeeAllocations.module.css';
import { EmployeeAllocationData } from '../types';

type Props = {
  data: EmployeeAllocationData[];
};

const EmployeeAllocations: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Employee Allocations</h2>
      <div className={styles.employeeList}>
        {data.map((employee) => (
          <div key={employee.id} className={styles.employeeItem}>
            <div className={styles.employeeInfo}>
              <h3 className={styles.employeeName}>{employee.name}</h3>
              <span className={styles.projectCount}>
                {employee.projectCount} projects
              </span>
            </div>
            <div className={styles.allocationInfo}>
              <div className={styles.amounts}>
                <span className={styles.allocated}>
                  ₹{employee.allocated.toLocaleString()}
                </span>
                <span className={styles.spent}>
                  ₹{employee.spent.toLocaleString()}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${(employee.spent / employee.allocated) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeAllocations;
