// src/pages/MyExpenses/components/AddExpenseModal/AddExpenseModal.tsx
import React, { useState } from 'react';
import styles from './AddExpenseModal.module.css';

interface AddExpenseModalProps {
  onSubmit: (expense: {
    projectId: string;
    projectName: string;
    amount: number;
    date: string;
    category: string;
    description?: string;
  }) => void;
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock project data - replace with actual data
  const projects = [
    { id: 'p1', name: 'Website Redesign' },
    { id: 'p2', name: 'Mobile App' },
  ];

  const categories = [
    'Software',
    'Hardware',
    'Travel',
    'Services',
    'Office Supplies',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectId) {
      newErrors.project = 'Project is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
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
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value })
              }
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
