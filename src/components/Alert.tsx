// src/components/Alert/Alert.tsx
import React from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  description,
  onClose,
}) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.content}>
        <div className={styles.message}>{message}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} className={styles.closeButton}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13M1 13L13 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
