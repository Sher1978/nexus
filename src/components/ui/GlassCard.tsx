import React from 'react';
import styles from './GlassCard.module.css';
import { clsx } from 'clsx';

interface GlassCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  title, 
  description, 
  children, 
  className,
  style
}) => {
  return (
    <div className={clsx(styles.card, className)} style={style}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  );
};
