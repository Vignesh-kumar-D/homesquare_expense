import { Project } from '../types';
import styles from './ProjectGrid.module.css';
// src/components/ProjectGrid/ProjectGrid.tsx
interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  userRole?: 'admin' | 'accountant' | 'employee';
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  userRole = 'admin', // default for now, should come from auth context later
}) => {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <div key={project.id} className={styles.projectCard}>
          <div
            className={styles.cardContent}
            onClick={() => onSelectProject(project)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.projectName}>{project.name}</div>
              <div className={`${styles.status} ${styles[project.status]}`}>
                {project.status}
              </div>
            </div>

            <div className={styles.clientName}>{project.clientName}</div>

            <div className={styles.budgetSection}>
              <div className={styles.budgetInfo}>
                <div className={styles.label}>Budget</div>
                <div className={styles.amount}>
                  ₹{project.totalBudget.toLocaleString()}
                </div>
              </div>
              <div className={styles.budgetInfo}>
                <div className={styles.label}>Spent</div>
                <div className={styles.amount}>
                  ₹{project.spentAmount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className={styles.progressText}>{project.progress}%</div>
            </div>
          </div>

          {userRole === 'admin' && (
            <div className={styles.cardActions}>
              <button
                className={styles.editButton}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  onEditProject(project);
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
