import React from 'react';
import styles from './TopProjects.module.css';
import { TopProjectData } from '../types';

type Props = {
  topProjects: TopProjectData[];
};

const TopProjects: React.FC<Props> = ({ topProjects }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Top Projects by Spending</h2>
      <div className={styles.projectList}>
        {topProjects.map((project) => (
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
