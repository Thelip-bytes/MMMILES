"use client";

import styles from './Loading.module.css';

const Loading = ({ fullScreen = true, size = 48, className = '' }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  if (fullScreen) {
    return (
      <div className={`${styles.fullScreenContainer} ${className}`}>
        <div className={styles.spinner} style={spinnerStyle}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.inlineContainer} ${className}`}>
      <div className={styles.spinner} style={spinnerStyle}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
    </div>
  );
};

export default Loading;
