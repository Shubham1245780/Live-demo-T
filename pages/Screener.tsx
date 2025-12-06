import React from 'react';
import { TVScreener } from '../components/tradingview/TVWidgets';

export const Screener = () => {
  return (
    <div className="h-[calc(100vh-4rem)] p-4">
      <div className="h-full bg-card rounded-xl border border-card-border overflow-hidden p-1 shadow-lg">
        <TVScreener />
      </div>
    </div>
  );
};