'use client';

import React from 'react';
import { Home, User, Scan, Grid } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'nexus' | 'profile' | 'scan' | 'matrix';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'nexus', icon: Home, label: 'Nexus' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'scan', icon: Scan, label: 'Scan' },
    { id: 'matrix', icon: Grid, label: 'Matrix' },
  ];

  return (
    <div className="bottom-nav-container">
      <nav className="bottom-nav-pill">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id as TabType)}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill-glow"
                  className="nav-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all duration-300"
              />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
