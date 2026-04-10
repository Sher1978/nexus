import React from 'react';
import styles from './GlassCard.module.css';
import { clsx } from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  title, 
  description, 
  children, 
  className,
  style,
  onClick,
  ...props
}) => {
  return (
    <div 
      className={clsx(styles.card, className)} 
      style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      {...props}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  );
};
