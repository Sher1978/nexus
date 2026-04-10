'use client';

import React from 'react';
import { Home, User, Scan, Grid } from 'lucide-react';

export type TabType = 'nexus' | 'profile' | 'scan' | 'matrix';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'nexus' ? 'active' : ''}`}
        onClick={() => onTabChange('nexus')}
      >
        <Home className="nav-icon" size={24} />
        <span className="nav-label">Nexus</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <User className="nav-icon" size={24} />
        <span className="nav-label">Profile</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'scan' ? 'active' : ''}`}
        onClick={() => onTabChange('scan')}
      >
        <Scan className="nav-icon" size={24} />
        <span className="nav-label">Scan</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'matrix' ? 'active' : ''}`}
        onClick={() => onTabChange('matrix')}
      >
        <Grid className="nav-icon" size={24} />
        <span className="nav-label">Matrix</span>
      </button>
    </nav>
  );
};
