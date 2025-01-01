// src/services/project.service.ts
import { db } from '../configs/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
  query,
  orderBy,
  where,
  getDoc,
} from 'firebase/firestore';
import { Project, ProjectFormData } from '../pages/projects/types';

export const addProject = async (projectData: ProjectFormData) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      remainingBudget: projectData.totalBudget,
      progress: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const updateProject = async (
  projectId: string,
  projectData: Partial<Project>
) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(projectsQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (projectId: string): Promise<Project> => {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId));
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }
    return { id: projectDoc.id, ...projectDoc.data() } as Project;
  } catch (error) {
    throw error;
  }
};
