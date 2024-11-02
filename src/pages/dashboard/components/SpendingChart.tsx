// src/pages/Dashboard/components/SpendingChart/SpendingChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './SpendingChart.module.css';

const data = [
  { month: 'Jan', budget: 150000, spent: 120000 },
  { month: 'Feb', budget: 160000, spent: 130000 },
  { month: 'Mar', budget: 155000, spent: 140000 },
  { month: 'Apr', budget: 175000, spent: 135000 },
  { month: 'May', budget: 165000, spent: 125000 },
  { month: 'Jun', budget: 180000, spent: 140000 },
];

const SpendingChart: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Monthly Spending Overview</h2>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
            <YAxis
              stroke="var(--color-text-secondary)"
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-sm)',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)' }}
            />
            <Line
              type="monotone"
              dataKey="spent"
              stroke="var(--color-error)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-error)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
