// src/pages/MyExpenses/components/AddExpenseModal/AddExpenseModal.tsx
import React, { useEffect, useState } from 'react';
import styles from './AddExpenseModal.module.css';
import { Expense } from '../types';
import Loader from '../../../components/Loader';
import { getProjects } from '../../../services/project.service';
import { EmployeeFund, Project } from '../../projects/types';
import { employeeFundService } from '../../../services/employeeFund.service';
import { useAuth } from '../../../context/AuthContext';

interface AddExpenseModalProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'status' | 'userId'>) => void;
  onClose: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    projectId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
  });
  const [selectedProjectFund, setSelectedProjectFund] =
    useState<EmployeeFund | null>(null);
  const { user } = useAuth(); // Get current user

  const handleProjectChange = async (projectId: string) => {
    try {
      const fund = await employeeFundService.getEmployeeFundByProject(
        user?.id ?? '0',
        projectId
      );
      setSelectedProjectFund(fund || null);
      setFormData({ ...formData, projectId });
    } catch (err) {
      setError('Failed to fetch project fund');
    }
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };
  const categories = [
    'Software',
    'Hardware',
    'Travel',
    'Services',
    'Office Supplies',
    'Others',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const amountNum = Number(formData.amount);
    if (!formData.projectId) {
      newErrors.project = 'Project is required';
    }
    if (!formData.amount || amountNum <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (amountNum > (selectedProjectFund?.remainingAmount ?? 0)) {
      newErrors.amount = `Amount exceeds available balance ${
        selectedProjectFund?.remainingAmount
          ? `(₹${selectedProjectFund.remainingAmount})`
          : ''
      }`;
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedProject = projects.find((p) => p.id === formData.projectId);
      if (!selectedProject) return;

      onSubmit({
        projectId: formData.projectId,
        projectName: selectedProject.name,
        amount: Number(formData.amount),
        date: formData.date,
        category: formData.category,
        description: formData.description,
      });
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Expense</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Project <span className={styles.required}>*</span>
            </label>
            <select
              className={`${styles.input} ${
                errors.project ? styles.error : ''
              }`}
              value={formData.projectId}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project && (
              <span className={styles.errorText}>{errors.project}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Amount <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              className={`${styles.input} ${errors.amount ? styles.error : ''}`}
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            {errors.amount && (
              <span className={styles.errorText}>{errors.amount}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Date <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              className={`${styles.input} ${errors.date ? styles.error : ''}`}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <span className={styles.errorText}>{errors.date}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              className={`${styles.input} ${
                errors.category ? styles.error : ''
              }`}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className={styles.errorText}>{errors.category}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter description (optional)"
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
