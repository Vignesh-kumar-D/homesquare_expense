import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import styles from './ProjectStatus.module.css';

const data = [
  { name: 'Active', value: 8 },
  { name: 'On Hold', value: 3 },
  { name: 'Completed', value: 5 },
];

const COLORS = [
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-primary)',
];

const ProjectStatus: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Project Status Distribution</h2>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-sm)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectStatus;
