"use client";

import Image from 'next/image';
import styles from './EmptyState.module.css';

const EmptyState = ({ 
  title = "Nothing here yet", 
  message = "No items found", 
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.iconWrapper}>
        <Image 
          src="/empty-state.png" 
          alt="Empty State" 
          width={180} 
          height={120} 
          className={styles.emptyImg}
          priority
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button className={styles.actionBtn} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
