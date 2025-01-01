import React from 'react';
import styles from './Loader.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

const Loader: React.FC<LoadingProps> = ({
  size = 'large',
  fullScreen = false,
  text = 'Loading...',
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const content = (
    <div className={styles.loadingContainer}>
      <div className={`${styles.spinner} ${getSizeClass()}`} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>;
  }

  return content;
};

export default Loader;
