import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../configs/firebase';
import { User } from '../configs/firebase.types';
import { EmployeeFund } from '../pages/projects/types';

interface ProfileData {
  name: string;
  role: 'admin' | 'accountant' | 'employee';
  email: string;
  mobile: string;
  totalBalance: number;
  joinedDate: string;
  position: string;
}

export const useProfile = (userId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Get user data
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data() as User;

        // Get employee funds to calculate total balance
        const fundsRef = collection(db, 'employeeFunds');
        const fundsSnap = await getDocs(
          query(fundsRef, where('employeeId', '==', userId))
        );
        const funds = fundsSnap.docs.map((doc) => doc.data() as EmployeeFund);

        // Calculate total remaining balance across all funds
        const totalBalance = funds.reduce(
          (sum, fund) => sum + fund.remainingAmount,
          0
        );
        setProfileData({
          name: userData.name,
          role: userData.role,
          email: userData.email,
          mobile: userData.mobile,
          position: userData.position,
          totalBalance,
          joinedDate:
            userData.createdAt?.toDate().toISOString() ||
            new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const handlePasswordReset = async () => {
    if (!profileData?.email) return;
    console.log();
    try {
      await sendPasswordResetEmail(auth, profileData.email);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  return { profileData, loading, error, handlePasswordReset };
};
