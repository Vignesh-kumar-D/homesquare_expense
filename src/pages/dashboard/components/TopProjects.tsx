// src/pages/Dashboard/components/TopProjects/TopProjects.tsx
import React from 'react';
import styles from './TopProjects.module.css';

const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    budget: 100000,
    spent: 75000,
    progress: 75,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    budget: 150000,
    spent: 100000,
    progress: 66,
  },
  // Add more mock projects
];

const TopProjects: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Top Projects by Spending</h2>
      <div className={styles.projectList}>
        {mockProjects.map((project) => (
          <div key={project.id} className={styles.projectItem}>
            <div className={styles.projectInfo}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <div className={styles.projectMeta}>
                <span className={styles.budget}>
                  Budget: ₹{project.budget.toLocaleString()}
                </span>
                <span className={styles.spent}>
                  Spent: ₹{project.spent.toLocaleString()}
                </span>
              </div>
            </div>
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${project.progress}%`,
                    backgroundColor: `var(--color-${
                      project.progress > 75 ? 'error' : 'primary'
                    })`,
                  }}
                />
              </div>
              <span className={styles.progressText}>{project.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProjects;
