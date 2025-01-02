// src/pages/Projects/Projects.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProject from './components/AddProject';
import ProjectGrid from './components/ProjectGrid';
import styles from './Projects.module.css';
import { Project, ProjectFormData } from './types';
import {
  addProject,
  updateProject,
  getProjects,
} from '../../services/project.service';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData: ProjectFormData) => {
    try {
      if (editingProject) {
        // Handle Edit
        await updateProject(editingProject.id, projectData);
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
        const newProjectId = await addProject(projectData);
        const newProject: Project = {
          id: newProjectId,
          ...projectData,
          remainingBudget: projectData.totalBudget,
          progress: 0,
        };
        setProjects([newProject, ...projects]);
      }
      setIsAddingProject(false);
    } catch (err) {
      console.error('Error saving project:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsAddingProject(true);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
                {user?.role === 'admin'
                  ? 'Get started by adding your first project'
                  : 'You have no projects. ask admin to add project'}
              </p>
              {user?.role === 'admin' && (
                <button
                  className={styles.emptyButton}
                  onClick={() => setIsAddingProject(true)}
                >
                  Add Project
                </button>
              )}
            </div>
          ) : (
            <ProjectGrid
              projects={projects}
              onSelectProject={(project) => navigate(`/projects/${project.id}`)}
              onEditProject={handleEditProject}
              userRole={user?.role ?? 'employee'}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
