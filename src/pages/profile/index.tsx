// src/pages/Profile/Profile.tsx
import React, { useState } from 'react';
import ChangePasswordModal from './components/ChangePasswordModal';
import styles from './Profile.module.css';

interface UserProfile {
  name: string;
  role: 'admin' | 'accountant' | 'employee';
  email: string;
  mobile: string;
  totalBalance: number;
  joinedDate: string;
  department: string;
}

const Profile: React.FC = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Mock user data - replace with actual user data
  const user: UserProfile = {
    name: 'John Doe',
    role: 'employee',
    email: 'john.doe@homesquare.com',
    mobile: '+91 9876543210',
    totalBalance: 25000,
    joinedDate: '2023-01-15',
    department: 'Engineering',
  };

  const handleLogout = () => {
    // Add logout logic
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Profile</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{user.name.charAt(0)}</div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{user.name}</h2>
              <span className={styles.userRole}>{user.role}</span>
            </div>
          </div>

          <div className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
              <span className={styles.balanceLabel}>Total Balance</span>
              <span className={styles.balanceAmount}>
                ₹{user.totalBalance.toLocaleString()}
              </span>
            </div>
            <div className={styles.balanceFooter}>
              <span className={styles.balanceNote}>
                Available across all projects
              </span>
            </div>
          </div>

          <div className={styles.detailsCard}>
            <h3 className={styles.detailsTitle}>Personal Information</h3>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{user.email}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mobile</span>
                <span className={styles.detailValue}>{user.mobile}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Department</span>
                <span className={styles.detailValue}>{user.department}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Joined Date</span>
                <span className={styles.detailValue}>
                  {new Date(user.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actionsCard}>
            <h3 className={styles.actionsTitle}>Account Settings</h3>

            <div className={styles.actionButtons}>
              <button
                className={styles.changePasswordButton}
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Change Password
              </button>

              <button className={styles.logoutButton} onClick={handleLogout}>
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {isChangePasswordOpen && (
        <ChangePasswordModal
          onClose={() => setIsChangePasswordOpen(false)}
          onSubmit={(oldPassword, newPassword) => {
            // Handle password change
            setIsChangePasswordOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
