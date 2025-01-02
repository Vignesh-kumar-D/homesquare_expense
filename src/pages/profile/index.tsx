import React, { useEffect, useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import Alert from '../../components/Alert';
import styles from './Profile.module.css';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Profile: React.FC = () => {
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const { logout, user } = useAuth();
  const handleLogout = () => {
    logout();
  };
  const { profileData, loading, error, handlePasswordReset } = useProfile(
    user?.id ?? ''
  );
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (resetSent || resetError) {
      timeoutId = setTimeout(() => {
        setResetSent(false);
        setResetError(null);
      }, 10000); // Clear after 10 seconds
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [resetSent, resetError]);

  const handlePasswordResetClick = async () => {
    try {
      setResetError(null);
      await handlePasswordReset();
      setResetSent(true);
    } catch (error: any) {
      // Handle specific Firebase auth errors
      const errorMessage = (() => {
        switch (error.code) {
          case 'auth/invalid-email':
            return 'Invalid email address';
          case 'auth/user-not-found':
            return 'No user found with this email';
          case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later';
          default:
            return 'Failed to send reset email. Please try again';
        }
      })();
      setResetError(errorMessage);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !profileData) {
    return <Alert type="error" message={error || 'Failed to load profile'} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Profile</h1>
      </div>

      {resetSent && (
        <Alert
          type="success"
          message="Password reset email sent"
          description="Please check your email to reset your password."
        />
      )}
      {resetError && (
        <Alert
          type="error"
          message="Password Reset Failed"
          description={resetError}
        />
      )}
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{profileData.name.charAt(0)}</div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{profileData.name}</h2>
              <span className={styles.userRole}>{profileData.role}</span>
            </div>
          </div>

          <div className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
              <span className={styles.balanceLabel}>Total Balance</span>
              <span className={styles.balanceAmount}>
                ₹{profileData.totalBalance.toLocaleString()}
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
                <span className={styles.detailValue}>{profileData.email}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mobile</span>
                <span className={styles.detailValue}>{profileData.mobile}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Position</span>
                <span className={styles.detailValue}>
                  {profileData.position}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Joined Date</span>
                <span className={styles.detailValue}>
                  {new Date(profileData.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actionsCard}>
            <h3 className={styles.actionsTitle}>Account Settings</h3>

            <div className={styles.actionButtons}>
              <button
                className={styles.changePasswordButton}
                onClick={handlePasswordResetClick}
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
                Reset Password
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
    </div>
  );
};

export default Profile;
