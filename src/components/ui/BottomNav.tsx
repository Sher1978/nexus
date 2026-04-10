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
    { id: 'matrix', icon: Grid, label: 'Matrix' },
    { id: 'scan', icon: Scan, label: 'Scan', neon: true },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="bottom-nav-container">
      <nav className="bottom-nav-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isNeon = tab.neon;

          return (
            <button
              key={tab.id}
              className={`nav-item ${isActive ? 'active' : ''} ${isNeon ? 'neon-item' : ''}`}
              onClick={() => onTabChange(tab.id as TabType)}
            >
              <div className="icon-container">
                {isActive && !isNeon && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white/5 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon 
                  size={24} 
                  strokeWidth={isActive || isNeon ? 2.5 : 2}
                  className={`transition-all duration-300 ${isNeon ? 'scale-110 drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]' : ''}`}
                />
              </div>
              <span className={`text-[10px] sm:text-[11px] font-bold mt-1.5 uppercase tracking-wider ${isNeon ? 'text-accent drop-shadow-[0_0_5px_rgba(var(--accent-rgb),0.5)]' : ''}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="nav-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
