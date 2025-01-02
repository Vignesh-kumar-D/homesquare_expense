import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../configs/firebase';

export const findUserByEmailOrPhone = async (identifier: string) => {
  try {
    const isEmail = identifier.includes('@');
    const field = isEmail ? 'email' : 'mobile';

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where(field, '==', identifier));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('User not found in the organization');
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role: data.role,
      position: data.position,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};
