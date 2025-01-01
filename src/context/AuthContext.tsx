import React, { createContext, useContext, useState, useEffect } from 'react';
import { findUserByEmailOrPhone } from '../utils/auth.utils';
import {
  Auth,
  signInWithEmailAndPassword,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../configs/firebase';
import { User } from '../configs/firebase.types';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [tempUserData, setTempUserData] = useState<any>(null); //

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();

        if (userData) {
          setUser({
            id: firebaseUser.uid,
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            role: userData.role,
            position: userData.position,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      // First check if user exists in our organization
      const existingUser = await findUserByEmailOrPhone(email);

      if (!existingUser) {
        throw new Error('User not found in the organization');
      }

      // Proceed with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set user data
      setUser({
        id: userCredential.user.uid,
        name: existingUser.name,
        email: existingUser.email,
        mobile: existingUser.mobile,
        role: existingUser.role,
        position: existingUser.position,
      });
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      // First check if user exists in our organization
      const existingUser = await findUserByEmailOrPhone(phoneNumber);

      if (!existingUser) {
        throw new Error('User not found in the organization');
      }

      // Store user data temporarily
      setTempUserData(existingUser);

      // Initialize reCAPTCHA
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );

      // Send OTP
      const provider = new PhoneAuthProvider(auth);
      const vId = await provider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );

      setVerificationId(vId);
    } catch (error) {
      console.error('Phone login error:', error);
      throw error;
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!verificationId || !tempUserData) {
      throw new Error('Missing verification data');
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);

      // Set user data from previously found user data
      setUser({
        id: userCredential.user.uid,
        ...tempUserData,
      });

      // Clear temporary data
      setTempUserData(null);
      setVerificationId(null);
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setVerificationId(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithEmail,
        loginWithPhone,
        verifyOTP,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
