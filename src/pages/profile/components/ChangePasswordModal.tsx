// src/components/ChangePasswordModal/ChangePasswordModal.tsx
import React, { useState } from 'react';
import styles from './ChangePasswordModal.module.css';

interface ChangePasswordModalProps {
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.currentPassword, formData.newPassword);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Change Password</h2>
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
            <label className={styles.label}>Current Password</label>
            <input
              type="password"
              className={`${styles.input} ${
                errors.currentPassword ? styles.error : ''
              }`}
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentPassword: e.target.value,
                })
              }
            />
            {errors.currentPassword && (
              <span className={styles.errorText}>{errors.currentPassword}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>New Password</label>
            <input
              type="password"
              className={`${styles.input} ${
                errors.newPassword ? styles.error : ''
              }`}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  newPassword: e.target.value,
                })
              }
            />
            {errors.newPassword && (
              <span className={styles.errorText}>{errors.newPassword}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm New Password</label>
            <input
              type="password"
              className={`${styles.input} ${
                errors.confirmPassword ? styles.error : ''
              }`}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
            />
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
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
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
