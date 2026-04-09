import React from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className, 
  ...props 
}) => {
  return (
    <button 
      className={clsx(styles.button, styles[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
