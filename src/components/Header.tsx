import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';
import { layout } from '../styles/layout';

interface HeaderProps {
  userName: string;
  userRole: 'admin' | 'accountant' | 'employee';
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole, onLogout }) => {
  const navigate = useNavigate();
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    ...styles.navLink,
    ...(isActive ? styles.activeNavLink : {}),
  });

  return (
    <header style={styles.header}>
      <div
        style={styles.logo}
        onClick={() => navigate('/dashboard')}
        role="button"
        tabIndex={0}
      >
        HomeSquare
      </div>

      <nav style={styles.nav}>
        <NavLink to="/dashboard" style={getNavLinkStyle}>
          Dashboard
        </NavLink>

        {userRole === 'admin' && (
          <>
            <NavLink to="/projects" style={getNavLinkStyle}>
              Projects
            </NavLink>
            <NavLink to="/employees" style={getNavLinkStyle}>
              Employees
            </NavLink>
          </>
        )}

        {(userRole === 'admin' || userRole === 'accountant') && (
          <NavLink to="/transactions" style={getNavLinkStyle}>
            Transactions
          </NavLink>
        )}

        <NavLink to="/my-expenses" style={getNavLinkStyle}>
          My Expenses
        </NavLink>
      </nav>

      <div style={styles.userSection}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{userName}</span>
          <span style={styles.userRole}>({userRole})</span>
        </div>
        <button
          onClick={onLogout}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          style={{
            ...styles.logoutButton,
            ...(isLogoutHovered ? styles.logoutButtonHovered : {}),
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};
export default Header;
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.md} ${spacing.xl}`,
    backgroundColor: colors.headerBg,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    height: '70px',
    position: 'sticky' as const,
    top: spacing.sm, // Added margin from top
    zIndex: layout.zIndex.header,
    background: 'linear-gradient(to right, #FFFFFF, #F8F8F8)',
    margin: `${spacing.sm} ${spacing.xl}`, // Added margin on all sides
    borderRadius: layout.borderRadius.medium, // Added border radius
    // Optional: if you want a subtle border
    border: `1px solid ${colors.border}15`, // 15 is opacity
  },
  logo: {
    fontSize: typography.navText,
    fontWeight: typography.weight.bold,
    color: colors.headerText,
    cursor: 'pointer',
    userSelect: 'none' as const,
    textShadow: '1px 1px 0px rgba(0, 0, 0, 0.05)',
  },
  nav: {
    display: 'flex',
    gap: spacing.lg,
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: colors.headerTextMuted,
    fontSize: typography.navText,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    fontWeight: typography.weight.medium,
    '&:hover': {
      color: colors.primary,
      backgroundColor: `${colors.primary}10`,
    },
  },
  activeNavLink: {
    backgroundColor: `${colors.primary}15`,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  userName: {
    fontSize: typography.navText,
    color: colors.headerText,
    fontWeight: typography.weight.medium,
  },
  userRole: {
    fontSize: typography.navText,
    color: colors.headerTextMuted,
    textTransform: 'capitalize' as const,
  },
  logoutButton: {
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: 'transparent',
    color: colors.error,
    border: `1px solid ${colors.error}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: typography.navText,
    fontWeight: typography.weight.medium,
  },
  logoutButtonHovered: {
    backgroundColor: colors.error,
    color: colors.headerBg,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
  },
} as const;
