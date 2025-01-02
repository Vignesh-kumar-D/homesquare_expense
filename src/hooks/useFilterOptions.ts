// src/hooks/useFilterOptions.ts
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { User } from '../configs/firebase.types';
import { Project } from '../pages/projects/types';

export const useFilterOptions = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    employees: [] as { value: string; label: string }[],
    projects: [] as { value: string; label: string }[],
    categories: [
      { value: 'Travel', label: 'Travel' },
      { value: 'Software', label: 'Software' },
      { value: 'Hardware', label: 'Hardware' },
      { value: 'Services', label: 'Services' },
      { value: 'Office Supplies', label: 'Office Supplies' },
      { value: 'Other', label: 'Other' },
      { value: 'All', label: 'All' },
      { value: 'Fund Allocated', label: 'Fund Allocated' },
    ],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [usersSnapshot, projectsSnapshot] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'projects')),
        ]);

        const employees = usersSnapshot.docs.map((doc) => {
          const user = doc.data() as User;
          return {
            value: doc.id,
            label: user.name,
          };
        });

        const projects = projectsSnapshot.docs.map((doc) => {
          const project = doc.data() as Project;
          return {
            value: doc.id,
            label: project.name,
          };
        });

        setOptions((prev) => ({
          ...prev,
          employees: [{ value: '', label: 'All Employees' }, ...employees],
          projects: [{ value: '', label: 'All Projects' }, ...projects],
        }));
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return { options, loading };
};
