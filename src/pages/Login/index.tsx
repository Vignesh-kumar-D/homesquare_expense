// src/pages/Login/Login.tsx
import React, { useState } from 'react';
import styles from './Login.module.css';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [formData, setFormData] = useState({
    identifier: '', // mobile or email
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    login({
      id: '1',
      name: 'Aravind',
      email: 'aravind@gmail.com',
      mobile: '9876543212',
      role: 'admin',
    });
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Home Square</h1>
          <p className={styles.subtitle}>Employee Login portal</p>
        </div>

        <div className={styles.methodSelector}>
          <button
            className={`${styles.methodButton} ${
              loginMethod === 'mobile' ? styles.active : ''
            }`}
            onClick={() => setLoginMethod('mobile')}
          >
            Mobile
          </button>
          <button
            className={`${styles.methodButton} ${
              loginMethod === 'email' ? styles.active : ''
            }`}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {loginMethod === 'mobile' ? 'Mobile Number' : 'Email'}
            </label>
            <input
              type={loginMethod === 'mobile' ? 'tel' : 'email'}
              className={`${styles.input} ${
                errors.identifier ? styles.error : ''
              }`}
              placeholder={
                loginMethod === 'mobile'
                  ? 'Enter mobile number'
                  : 'Enter email address'
              }
              value={formData.identifier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  identifier: e.target.value,
                })
              }
            />
            {errors.identifier && (
              <span className={styles.errorText}>{errors.identifier}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={`${styles.input} ${
                errors.password ? styles.error : ''
              }`}
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
            <NavLink to="/forgot-password" className={styles.forgotPassword}>
              Forgot Password?
            </NavLink>
          </div>

          <button type="submit" className={styles.submitButton}>
            Log In
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Having trouble logging in? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
