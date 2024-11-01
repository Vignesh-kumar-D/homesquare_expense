// src/pages/Projects/Projects.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProject from './components/AddProject';
import ProjectGrid from './components/ProjectGrid';
import styles from './Projects.module.css';
import { ProjectFormData } from './types';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: string;
  endDate?: string;
  totalBudget: number;
  spentAmount: number;
  status: 'active' | 'on-hold' | 'completed';
  progress: number;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      clientName: 'Microsoft',
      description: 'Complete website overhaul',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      totalBudget: 100000,
      spentAmount: 25000,
      status: 'active',
      progress: 25,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      clientName: 'Google',
      description: 'New mobile application',
      startDate: '2024-02-15',
      totalBudget: 150000,
      spentAmount: 50000,
      status: 'active',
      progress: 33,
    },
  ]);

  const handleAddProject = (projectData: ProjectFormData) => {
    if (editingProject) {
      // Handle Edit
      setProjects(
        projects.map((project) =>
          project.id === editingProject.id
            ? { ...project, ...projectData }
            : project
        )
      );
      setEditingProject(null);
    } else {
      // Handle Add
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectData,
        spentAmount: 0,
        progress: 0,
      };
      setProjects([...projects, newProject]);
    }
    setIsAddingProject(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsAddingProject(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Projects</h1>
          <span className={styles.projectCount}>
            {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>
        {!isAddingProject && !editingProject && (
          <button
            className={styles.addButton}
            onClick={() => setIsAddingProject(true)}
          >
            <span className={styles.addIcon}>+</span>
            Add Project
          </button>
        )}
      </div>

      {isAddingProject ? (
        <AddProject
          onSubmit={handleAddProject}
          onCancel={() => {
            setIsAddingProject(false);
            setEditingProject(null);
          }}
          initialData={editingProject || undefined}
        />
      ) : (
        <div className={styles.content}>
          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h2 className={styles.emptyTitle}>No Projects Yet</h2>
              <p className={styles.emptyText}>
                Get started by adding your first project
              </p>
              <button
                className={styles.emptyButton}
                onClick={() => setIsAddingProject(true)}
              >
                Add Project
              </button>
            </div>
          ) : (
            <ProjectGrid
              projects={projects}
              onSelectProject={(project) => navigate(`/projects/${project.id}`)}
              onEditProject={handleEditProject}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
