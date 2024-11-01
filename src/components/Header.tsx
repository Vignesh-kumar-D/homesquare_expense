// src/components/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  userName: string;
  userRole: 'admin' | 'accountant' | 'employee';
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? `${styles.overlayLink} ${styles.active}`
      : styles.overlayLink;
  };

  return (
    <>
      <header
        className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}
      >
        <div
          className={styles.logo}
          onClick={() => navigate('/dashboard')}
          role="button"
          tabIndex={0}
        >
          HomeSquare
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>

          {userRole === 'admin' && (
            <>
              <NavLink to="/projects" className={getNavLinkClass}>
                Projects
              </NavLink>
              <NavLink to="/employees" className={getNavLinkClass}>
                Employees
              </NavLink>
            </>
          )}

          {(userRole === 'admin' || userRole === 'accountant') && (
            <NavLink to="/transactions" className={getNavLinkClass}>
              Transactions
            </NavLink>
          )}

          <NavLink to="/my-expenses" className={getNavLinkClass}>
            My Expenses
          </NavLink>

          <button className={styles.desktopLogoutButton} onClick={onLogout}>
            Logout
          </button>
        </nav>

        {/* Mobile User Info */}
        <div className={styles.mobileUserInfo}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.userRole}>({userRole})</span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className={`${styles.menuButton} ${
            isMenuOpen ? styles.menuOpen : ''
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.show : ''}`}>
        <nav className={styles.overlayContent}>
          <div className={styles.overlayUserInfo}>
            <span className={styles.overlayUserName}>{userName}</span>
            <span className={styles.overlayUserRole}>({userRole})</span>
          </div>

          <div className={styles.overlayLinks}>
            <NavLink
              to="/dashboard"
              className={getMobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>

            {userRole === 'admin' && (
              <>
                <NavLink
                  to="/projects"
                  className={getMobileNavLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/employees"
                  className={getMobileNavLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Employees
                </NavLink>
              </>
            )}

            {(userRole === 'admin' || userRole === 'accountant') && (
              <NavLink
                to="/transactions"
                className={getMobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Transactions
              </NavLink>
            )}

            <NavLink
              to="/my-expenses"
              className={getMobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              My Expenses
            </NavLink>
          </div>

          <button
            className={styles.overlayLogoutButton}
            onClick={() => {
              onLogout();
              setIsMenuOpen(false);
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
