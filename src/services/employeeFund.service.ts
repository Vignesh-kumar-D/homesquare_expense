import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../configs/firebase';
import { EmployeeFund, Project } from '../pages/projects/types';
import { User } from '../configs/firebase.types';

export const employeeFundService = {
  // Get all funds for a project
  getAllEmployees: async (): Promise<User[]> => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error) {
      throw error;
    }
  },
  getProjectFunds: async (projectId: string): Promise<EmployeeFund[]> => {
    const fundsQuery = query(
      collection(db, 'employeeFunds'),
      where('projectId', '==', projectId)
    );
    const snapshot = await getDocs(fundsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EmployeeFund[];
  },

  // Allocate funds to employee
  allocateFunds: async (
    projectId: string,
    employeeId: string,
    amount: number
  ): Promise<void> => {
    await runTransaction(db, async (transaction) => {
      // Get project data
      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await transaction.get(projectRef);
      const currentProject = projectDoc.data() as Project;

      // Validate budget
      if (currentProject.remainingBudget < amount) {
        throw new Error('Insufficient project budget');
      }

      // Check existing fund
      const existingFundQuery = query(
        collection(db, 'employeeFunds'),
        where('projectId', '==', projectId),
        where('employeeId', '==', employeeId)
      );
      const existingFundDocs = await getDocs(existingFundQuery);

      if (existingFundDocs.empty) {
        // Create new fund
        const fundRef = doc(collection(db, 'employeeFunds'));
        transaction.set(fundRef, {
          employeeId,
          projectId,
          allocatedAmount: amount,
          spentAmount: 0,
          category: 'Fund Allocated',
          remainingAmount: amount,
          lastUpdated: Timestamp.now(),
        });
      } else {
        // Update existing fund
        const existingFund = existingFundDocs.docs[0];
        transaction.update(existingFund.ref, {
          allocatedAmount: existingFund.data().allocatedAmount + amount,
          remainingAmount: existingFund.data().remainingAmount + amount,
          lastUpdated: Timestamp.now(),
        });
      }

      // Update project
      transaction.update(projectRef, {
        remainingBudget: currentProject.remainingBudget - amount,
      });
    });
  },
  getEmployeeFundByProject: async (employeeId: string, projectId: string) => {
    const fundQuery = query(
      collection(db, 'employeeFunds'),
      where('employeeId', '==', employeeId),
      where('projectId', '==', projectId)
    );
    const snapshot = await getDocs(fundQuery);
    return snapshot.docs[0]?.data() as EmployeeFund | undefined;
  },
};
