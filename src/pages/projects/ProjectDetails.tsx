import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProjectDetails.module.css';
import { EmployeeFund, Project } from './types';
import { User } from '../../configs/firebase.types';
import { employeeFundService } from '../../services/employeeFund.service';
import { getProjectById } from '../../services/project.service';
import Loader from '../../components/Loader';
const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [employeeFunds, setEmployeeFunds] = useState<EmployeeFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [allocationError, setAllocationError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId) return;

        // Fetch all required data
        const [projectData, employeesData, fundsData] = await Promise.all([
          getProjectById(projectId),
          employeeFundService.getAllEmployees(),
          employeeFundService.getProjectFunds(projectId),
        ]);

        setProject(projectData);
        setEmployees(employeesData);
        setEmployeeFunds(fundsData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleAllocate = async () => {
    if (!selectedEmployee || !amount || Number(amount) <= 0 || !projectId)
      return;

    const amountNum = Number(amount);

    // Clear any previous errors
    setAllocationError(null);

    // Check if amount exceeds remaining budget
    if (amountNum > (project?.remainingBudget ?? 0)) {
      setAllocationError(
        `Cannot allocate ₹${amountNum.toLocaleString()}. Maximum available amount is ₹${project?.remainingBudget.toLocaleString()}`
      );
      return;
    }

    try {
      await employeeFundService.allocateFunds(
        projectId,
        selectedEmployee,
        amountNum
      );

      // Reset form
      setSelectedEmployee('');
      setAmount('');
      setDescription('');
      setAllocationError(null); // Clear error on success

      // Refresh data
      const [updatedProject, updatedFunds] = await Promise.all([
        getProjectById(projectId),
        employeeFundService.getProjectFunds(projectId),
      ]);

      setProject(updatedProject);
      setEmployeeFunds(updatedFunds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to allocate funds');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;
  return (
    <div className={styles.container}>
      {/* Rest of your JSX remains similar, but using real data */}
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
        <div className={styles.budgetInfo}>
          <div>Total Budget: ₹{project?.totalBudget?.toLocaleString()}</div>
          <div>
            Allocated: ₹
            {(
              Number(project?.totalBudget) - Number(project?.remainingBudget)
            )?.toLocaleString()}
          </div>
          <div>Remaining: ₹{project?.remainingBudget?.toLocaleString()}</div>
        </div>
      </div>
      {allocationError && (
        <div className={styles.errorAlert}>
          <div className={styles.errorContent}>
            <span className={styles.errorIcon}>⚠️</span>
            {allocationError}
          </div>
        </div>
      )}
      {/* Allocation form */}
      <div className={styles.content}>
        <div className={styles.allocationForm}>
          <h2 className={styles.sectionTitle}>New Allocation</h2>
          <div className={styles.formGrid}>
            {/* Employee select */}
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
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount input */}
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
                max={project.remainingBudget}
              />
            </div>

            {/* Description input */}
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
              disabled={!selectedEmployee || !amount || Number(amount) <= 0}
            >
              Allocate Funds
            </button>
          </div>
        </div>

        {/* Employee Funds List */}
        <div className={styles.allocations}>
          <h2 className={styles.sectionTitle}>Employee Funds</h2>
          {employeeFunds.length === 0 ? (
            <div className={styles.emptyState}>No allocations yet</div>
          ) : (
            <div className={styles.allocationList}>
              {employeeFunds.map((fund) => (
                <div key={fund.id} className={styles.allocationCard}>
                  <div className={styles.allocationHeader}>
                    <span className={styles.employeeName}>
                      {
                        employees.find((emp) => emp.id === fund.employeeId)
                          ?.name
                      }
                    </span>
                    <span className={styles.amount}>
                      ₹{fund?.allocatedAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.allocationMeta}>
                    <span className={styles.remainingAmount}>
                      Remaining: ₹{fund?.remainingAmount?.toLocaleString()}
                    </span>
                    <span className={styles.spentAmount}>
                      Spent: ₹{fund?.spentAmount?.toLocaleString()}
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
