// src/pages/Projects/components/AddProject/AddProject.tsx
import React, { useState } from 'react';
import styles from './AddProject.module.css';
import { FormErrors, Project, ProjectFormData } from '../types';

interface AddProjectProps {
  onSubmit: (projectData: ProjectFormData) => void;
  onCancel: () => void;
  initialData?: Project;
}

const AddProject: React.FC<AddProjectProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    clientName: initialData?.clientName || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    totalBudget: initialData?.totalBudget || 0,
    status: initialData?.status || 'active',
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormErrors> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.clientName.trim())
      newErrors.clientName = 'Client name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.totalBudget <= 0)
      newErrors.totalBudget = 'Budget must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>
          {' '}
          {initialData ? 'Edit Project' : 'Add New Project'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Project Name
              <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter project name"
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="clientName" className={styles.label}>
              Client Name
              <span className={styles.required}>*</span>
            </label>
            <input
              id="clientName"
              type="text"
              className={`${styles.input} ${
                errors.clientName ? styles.error : ''
              }`}
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              placeholder="Enter client name"
            />
            {errors.clientName && (
              <span className={styles.errorText}>{errors.clientName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter project description"
              rows={4}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Start Date
                <span className={styles.required}>*</span>
              </label>
              <input
                id="startDate"
                type="date"
                className={`${styles.input} ${
                  errors.startDate ? styles.error : ''
                }`}
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
              {errors.startDate && (
                <span className={styles.errorText}>{errors.startDate}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.label}>
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                className={styles.input}
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                min={formData.startDate}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="budget" className={styles.label}>
              Total Budget
              <span className={styles.required}>*</span>
            </label>
            <input
              id="budget"
              type="number"
              className={`${styles.input} ${
                errors.totalBudget ? styles.error : ''
              }`}
              value={formData.totalBudget || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalBudget: Number(e.target.value),
                })
              }
              placeholder="Enter total budget"
              min="0"
              step="0.01"
            />
            {errors.totalBudget && (
              <span className={styles.errorText}>{errors.totalBudget}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              className={styles.select}
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'active' | 'on-hold',
                })
              }
            >
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {initialData ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
