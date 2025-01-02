// src/pages/Login/Login.tsx
import React, { useState } from 'react';
import styles from './Login.module.css';
import { useAuth } from '../../context/AuthContext';
import {
  signInWithEmailAndPassword,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from 'firebase/auth';
import { auth, db } from '../../configs/firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithPhone } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [formData, setFormData] = useState({
    identifier: '', // mobile or email
    password: '', // password or OTP
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.identifier,
        formData.password
      );

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      if (userData) {
        // Use loginWithEmail from context instead of login
        await loginWithEmail(formData.identifier, formData.password);
        navigate('/projects');
      }
    } catch (error: any) {
      setErrors({ identifier: error.message });
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );
    }
  };
  const handlePhoneLogin = async () => {
    try {
      if (!showOTP) {
        // First step: Send OTP
        setupRecaptcha();
        const phoneNumber = formData.identifier.startsWith('+91')
          ? formData.identifier
          : `+91${formData.identifier}`;

        const provider = new PhoneAuthProvider(auth);
        const verificationId = await provider.verifyPhoneNumber(
          phoneNumber,
          window.recaptchaVerifier
        );

        setVerificationId(verificationId);
        setShowOTP(true);
        setFormData({ ...formData, password: '' }); // Clear password field for OTP
      } else {
        // Second step: Verify OTP
        if (!verificationId) {
          throw new Error('Verification ID not found');
        }

        // Use loginWithPhone from context
        await loginWithPhone(formData.identifier);
        navigate('/projects');
      }
    } catch (error: any) {
      setErrors({ identifier: error.message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.identifier) {
      setErrors({ identifier: 'This field is required' });
      return;
    }

    if (!showOTP && !formData.password && loginMethod === 'email') {
      setErrors({ password: 'Password is required' });
      return;
    }

    try {
      if (loginMethod === 'email') {
        await handleEmailLogin();
      } else {
        await handlePhoneLogin();
      }
    } catch (error: any) {
      setErrors({ general: error.message });
    }
  };

  const handleMethodChange = (method: 'mobile' | 'email') => {
    setLoginMethod(method);
    setFormData({ identifier: '', password: '' });
    setErrors({});
    setShowOTP(false);
    setVerificationId(null);
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
            onClick={() => handleMethodChange('mobile')}
          >
            Mobile
          </button>
          <button
            className={`${styles.methodButton} ${
              loginMethod === 'email' ? styles.active : ''
            }`}
            onClick={() => handleMethodChange('email')}
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
                setFormData({ ...formData, identifier: e.target.value })
              }
              disabled={showOTP}
            />
            {errors.identifier && (
              <span className={styles.errorText}>{errors.identifier}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              {loginMethod === 'mobile' && showOTP ? 'OTP' : 'Password'}
            </label>
            <input
              // type={loginMethod === 'mobile' && showOTP ? 'text' : 'password'}
              className={`${styles.input} ${
                errors.password ? styles.error : ''
              }`}
              placeholder={
                loginMethod === 'mobile' && showOTP
                  ? 'Enter OTP'
                  : 'Enter password'
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
            {loginMethod === 'email' && (
              <NavLink to="/forgot-password" className={styles.forgotPassword}>
                Forgot Password?
              </NavLink>
            )}
          </div>

          {/* Hidden reCAPTCHA container */}
          <div id="recaptcha-container"></div>

          <button type="submit" className={styles.submitButton}>
            {loginMethod === 'mobile' && !showOTP ? 'Send OTP' : 'Log In'}
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
