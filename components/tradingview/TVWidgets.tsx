import React, { useEffect, useRef } from 'react';

// --- Ticker Tape ---
export const TVTickerTape = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" }
      ],
      showSymbolLogo: true,
      colorTheme: theme,
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en"
    });
    containerRef.current.appendChild(script);
  }, [theme]);
  return <div className="tradingview-widget-container" ref={containerRef}><div className="tradingview-widget-container__widget"></div></div>;
};

// --- Market Overview ---
export const TVMarketOverview = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      dateRange: "12M",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "100%",
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD" },
            { s: "FOREXCOM:NSXUSD" },
            { s: "FOREXCOM:DJI" },
            { s: "INDEX:NKY" },
            { s: "INDEX:DEU40" },
            { s: "FOREXCOM:UKXGBP" }
          ]
        },
        {
          title: "Futures",
          symbols: [
            { s: "CME_MINI:ES1!" },
            { s: "CME:6E1!" },
            { s: "COMEX:GC1!" },
            { s: "NYMEX:CL1!" },
            { s: "NYMEX:NG1!" },
            { s: "CBOT:ZC1!" }
          ]
        },
        {
          title: "Crypto",
          symbols: [
            { s: "BINANCE:BTCUSDT" },
            { s: "BINANCE:ETHUSDT" },
            { s: "BINANCE:SOLUSDT" },
            { s: "BINANCE:XRPUSDT" }
          ]
        }
      ]
    });
    containerRef.current.appendChild(script);
  }, [theme]);
  return <div className="tradingview-widget-container h-full" ref={containerRef}><div className="tradingview-widget-container__widget h-full"></div></div>;
};

// --- Screener ---
export const TVScreener = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      defaultScreen: "general",
      market: "crypto",
      showToolbar: true,
      colorTheme: theme,
      locale: "en"
    });
    containerRef.current.appendChild(script);
  }, [theme]);
  return <div className="tradingview-widget-container h-full" ref={containerRef}><div className="tradingview-widget-container__widget h-full"></div></div>;
};

// --- Single Ticker Mini ---
export const TVMiniChart = ({ symbol, theme = 'dark' }: { symbol: string, theme?: 'light' | 'dark' }) => {
   const containerRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        symbol: symbol,
        width: "100%",
        height: "100%",
        locale: "en",
        dateRange: "12M",
        colorTheme: theme,
        isTransparent: true,
        autosize: true,
        largeChartUrl: ""
      });
      containerRef.current.appendChild(script);
   }, [symbol, theme]);

   return <div className="tradingview-widget-container h-full w-full" ref={containerRef}><div className="tradingview-widget-container__widget h-full w-full"></div></div>;
}

// --- Technical Analysis ---
export const TVTechnicalAnalysis = ({ symbol, theme = 'dark' }: { symbol: string, theme?: 'light' | 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        interval: "1m",
        width: "100%",
        isTransparent: false,
        height: "100%",
        symbol: symbol,
        showIntervalTabs: true,
        displayMode: "single",
        locale: "en",
        colorTheme: theme
    });
    containerRef.current.appendChild(script);
  }, [symbol, theme]);
  return <div className="tradingview-widget-container h-full" ref={containerRef}><div className="tradingview-widget-container__widget h-full"></div></div>;
}
