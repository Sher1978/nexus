'use client';

import React from 'react';
import styles from './SyncTabs.module.css';
import { clsx } from 'clsx';
import { Briefcase, Users, Heart } from 'lucide-react';

export type SyncTab = 'business' | 'friendship' | 'personal';

interface SyncTabsProps {
  activeTab: SyncTab;
  onChange: (tab: SyncTab) => void;
  hidePersonal?: boolean;
}

export const SyncTabs: React.FC<SyncTabsProps> = ({ activeTab, onChange, hidePersonal }) => {
  return (
    <div className={styles.tabsContainer}>
      <button 
        className={clsx(styles.tab, activeTab === 'business' && styles.active)}
        onClick={() => onChange('business')}
      >
        <Briefcase size={18} />
        <span>Бизнес</span>
      </button>
      <button 
        className={clsx(styles.tab, activeTab === 'friendship' && styles.active)}
        onClick={() => onChange('friendship')}
      >
        <Users size={18} />
        <span>Дружба</span>
      </button>
      {!hidePersonal && (
        <button 
          className={clsx(styles.tab, activeTab === 'personal' && styles.active)}
          onClick={() => onChange('personal')}
        >
          <Heart size={18} />
          <span>Личное</span>
        </button>
      )}
    </div>
  );
};
