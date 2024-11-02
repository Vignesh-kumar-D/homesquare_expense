// src/pages/Projects/components/ProjectDetails/ProjectDetails.tsx
import React, { useState } from 'react';
import styles from './ProjectDetails.module.css';
import { Project } from './types';
import { useNavigate, useParams } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
}

interface Allocation {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  description: string;
}

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
}

const mockProject = {
  id: '1',
  name: 'Website Redesign',
  clientName: 'Microsoft',
  description: 'Complete website overhaul',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  totalBudget: 100000,
  spentAmount: 25000,
  status: 'active' as const,
  progress: 25,
};

const mockEmployees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
];
const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  // In real app, fetch project using projectId
  const project = mockProject;

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAllocate = () => {
    if (!selectedEmployee || !amount || Number(amount) <= 0) return;

    const newAllocation: Allocation = {
      id: Date.now().toString(),
      employeeId: selectedEmployee,
      amount: Number(amount),
      date: new Date().toISOString(),
      description,
    };

    setAllocations([...allocations, newAllocation]);
    setSelectedEmployee('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => navigate('/projects')}
        className={styles.backButton}
      >
        ← Back to Projects
      </button>

      <div className={styles.projectHeader}>
        <h1 className={styles.projectName}>{project.name}</h1>
        <div className={styles.projectMeta}>
          <span className={styles.client}>{project.clientName}</span>
          <span className={`${styles.status} ${styles[project.status]}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.allocationForm}>
          <h2 className={styles.sectionTitle}>New Allocation</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="employee">
                Employee
              </label>
              <select
                id="employee"
                className={styles.select}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="amount">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                className={styles.input}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <input
                id="description"
                type="text"
                className={styles.input}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <button
              className={styles.allocateButton}
              onClick={handleAllocate}
              disabled={!selectedEmployee || !amount}
            >
              Allocate Funds
            </button>
          </div>
        </div>

        <div className={styles.allocations}>
          <h2 className={styles.sectionTitle}>Allocations</h2>
          {allocations.length === 0 ? (
            <div className={styles.emptyState}>No allocations yet</div>
          ) : (
            <div className={styles.allocationList}>
              {allocations.map((allocation) => (
                <div key={allocation.id} className={styles.allocationCard}>
                  <div className={styles.allocationHeader}>
                    <span className={styles.employeeName}>
                      {
                        mockEmployees.find(
                          (emp) => emp.id === allocation.employeeId
                        )?.name
                      }
                    </span>
                    <span className={styles.amount}>
                      ₹{allocation.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.allocationMeta}>
                    <span className={styles.date}>
                      {new Date(allocation.date).toLocaleDateString()}
                    </span>
                    <span className={styles.description}>
                      {allocation.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
