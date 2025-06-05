// src/components/NetworkStatus.tsx
import React, { useEffect, useState } from 'react';
import styles from './NetworkStatus.module.css';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={styles.offlineBar}>
      You're offline. Some features may be unavailable. Please turn on your
      internet
    </div>
  );
};

export default NetworkStatus;
