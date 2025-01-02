import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const userName = user?.name;
  const userRole = user?.role;
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

          <NavLink to="/projects" className={getNavLinkClass}>
            Projects
          </NavLink>

          {userRole === 'admin' && (
            <NavLink to="/employees" className={getNavLinkClass}>
              Employees
            </NavLink>
          )}

          {(userRole === 'admin' || userRole === 'accountant') && (
            <NavLink to="/transactions" className={getNavLinkClass}>
              Transactions
            </NavLink>
          )}

          <NavLink to="/my-expenses" className={getNavLinkClass}>
            My Expenses
          </NavLink>
        </nav>

        {/* Desktop User Section */}
        <div className={styles.desktopUserSection}>
          <div
            className={styles.userInfo}
            onClick={() => navigate('/profile')}
            role="button"
            tabIndex={0}
          >
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userRole}>({userRole})</span>
          </div>
          <button className={styles.desktopLogoutButton} onClick={logout}>
            Logout
          </button>
        </div>

        {/* Mobile User Info */}
        <div
          className={styles.mobileUserInfo}
          onClick={() => {
            setIsMenuOpen(false);
            navigate('/profile');
          }}
          role="button"
          tabIndex={0}
        >
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
          <div
            className={styles.overlayUserInfo}
            onClick={() => {
              navigate('/profile');
              setIsMenuOpen(false);
            }}
            role="button"
            tabIndex={0}
          >
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

            <NavLink
              to="/projects"
              className={getMobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </NavLink>

            {userRole === 'admin' && (
              <NavLink
                to="/employees"
                className={getMobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Employees
              </NavLink>
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
              logout();
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
