import styles from './StatsCard.module.css';

interface StatsCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
  trendValue?: number;
  trendDirection?: 'up' | 'down';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  isCurrency = false,
  trendValue,
  trendDirection,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>
        <div className={styles.value}>
          {isCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()}
        </div>
        {trendValue && (
          <div
            className={`${styles.trend} ${
              trendDirection === 'up' ? styles.trendUp : styles.trendDown
            }`}
          >
            {trendDirection === 'up' ? '↑' : '↓'} {trendValue}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
