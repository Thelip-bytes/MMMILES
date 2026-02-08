"use client";

import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius = '4px', className = '', style = {} }) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius,
        ...style,
      }}
    />
  );
};

export default Skeleton;
