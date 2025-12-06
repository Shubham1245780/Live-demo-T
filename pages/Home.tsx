import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TVTickerTape, TVMarketOverview, TVMiniChart } from '../components/tradingview/TVWidgets';
import { TrendingUp, Shield, Zap, Globe } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen pb-12">
      <div className="w-full h-12">
        <TVTickerTape />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Next-Gen Market Analysis <br/> & Paper Trading
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Track live global markets, analyze with professional charts, and master your strategies with our risk-free paper trading engine.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/charts">
              <Button size="lg">Open Charts</Button>
            </Link>
            <Link to="/paper-trading">
              <Button size="lg" variant="outline">Start Paper Trading</Button>
            </Link>
          </div>
        </div>

        {/* Trending Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {['BTCUSDT', 'ETHUSDT', 'SPX500', 'EURUSD'].map((symbol) => (
            <div key={symbol} className="bg-card border border-card-border rounded-xl overflow-hidden h-48 shadow-lg hover:shadow-primary/10 transition-shadow">
               <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                  <span className="font-bold text-lg">{symbol}</span>
                  <Link to={`/charts?symbol=${symbol}`} className="text-primary text-xs hover:underline">Full Chart</Link>
               </div>
               <div className="h-full">
                 <TVMiniChart symbol={symbol} />
               </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           <div className="bg-card/50 p-6 rounded-xl border border-card-border hover:bg-card transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-4">
                <TrendingUp />
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Charts</h3>
              <p className="text-gray-400">Powered by TradingView, get access to hundreds of indicators, drawing tools, and multi-timeframe analysis.</p>
           </div>
           <div className="bg-card/50 p-6 rounded-xl border border-card-border hover:bg-card transition-colors">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center text-success mb-4">
                <Shield />
              </div>
              <h3 className="text-xl font-bold mb-2">Risk-Free Trading</h3>
              <p className="text-gray-400">Practice with $100,000 in virtual funds. Test strategies on crypto, forex, and stocks without losing a penny.</p>
           </div>
           <div className="bg-card/50 p-6 rounded-xl border border-card-border hover:bg-card transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                <Zap />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Data</h3>
              <p className="text-gray-400">Experience market movements as they happen. Zero latency issues with our direct widget integrations.</p>
           </div>
        </div>

        {/* Market Overview Widget Section */}
        <div className="h-[600px] bg-card rounded-xl border border-card-border overflow-hidden p-1">
          <TVMarketOverview />
        </div>
      </div>
    </div>
  );
};