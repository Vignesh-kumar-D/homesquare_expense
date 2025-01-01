// Create users in Authentication and Firestore
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { User } from '../configs/firebase.types';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../configs/firebase';

const createUserWithRole = async (
  email: string,
  password: string,
  userData: Omit<User, 'id'>
) => {
  try {
    // Create user in Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Add user data to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...userData,
      createdAt: new Date(),
    });

    console.log(`User created successfully: ${userData.role}`);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Create admin user
await createUserWithRole('admin@homesquare.com', 'password123', {
  name: 'Admin User',
  email: 'admin@homesquare.com',
  mobile: '8903831083',
  role: 'admin',
  position: 'director',
});

// Create accountant user
await createUserWithRole('accountant@homesquare.com', 'password123', {
  name: 'Accountant User',
  email: 'accountant@homesquare.com',
  mobile: '8903831083',
  role: 'accountant',
  position: 'accountant',
});

// Create employee user
await createUserWithRole('employee@homesquare.com', 'password123', {
  name: 'Employee User',
  email: 'employee@homesquare.com',
  mobile: '1234567892',
  role: 'employee',
  position: 'supervisor',
});
