import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TVChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
  autosize?: boolean;
  interval?: string;
}

export const TVChart: React.FC<TVChartProps> = ({ 
  symbol, 
  theme = 'dark', 
  autosize = true,
  interval = 'D'
}) => {
  const containerId = useRef(`tv-chart-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (window.TradingView) {
      new window.TradingView.widget({
        autosize: autosize,
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: containerId.current,
        studies: ["RSI@tv-basicstudies"],
        hide_volume: false
      });
    }
  }, [symbol, theme, interval, autosize]);

  return (
    <div id={containerId.current} className="w-full h-full min-h-[400px]" />
  );
};