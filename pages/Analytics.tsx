
import React, { useState } from 'react';
import { useStore } from '../store';
import { BarChart2, Calendar, PieChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const Analytics = () => {
  const { user, isAuthenticated } = useStore();
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');

  if (!isAuthenticated) {
     return <div className="p-12 text-center text-gray-500">Please log in to view analytics.</div>;
  }

  const history = user?.history || [];
  
  // Calculate Metrics based on REAL history
  const totalTrades = history.length;
  const netPnL = history.reduce((acc, t) => acc + t.realizedPL, 0);
  const wins = history.filter(t => t.realizedPL > 0);
  const losses = history.filter(t => t.realizedPL <= 0);
  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;
  
  const totalProfit = wins.reduce((acc, t) => acc + t.realizedPL, 0);
  const totalLoss = Math.abs(losses.reduce((acc, t) => acc + t.realizedPL, 0));
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 100 : 0;

  // Dynamic Equity Curve Generation
  let equityCurvePoints: number[] = [0]; // Start at 0
  if (history.length > 0) {
    equityCurvePoints = history.map((t, i) => {
        const cumSum = history.slice(0, i + 1).reduce((sum, trade) => sum + trade.realizedPL, 0);
        return cumSum;
    });
    // Prepend 0 to show start point
    equityCurvePoints = [0, ...equityCurvePoints];
  }

  // Calculate Chart Scaling
  const maxVal = Math.max(...equityCurvePoints, 100); // Default range if flat
  const minVal = Math.min(...equityCurvePoints, -100);
  const range = maxVal - minVal;

  // Dynamic Monthly Breakdown
  const monthlyStats = history.reduce((acc, trade) => {
    const date = new Date(trade.timestamp);
    const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    if (!acc[key]) acc[key] = 0;
    acc[key] += trade.realizedPL;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.keys(monthlyStats).length > 0
    ? Object.entries(monthlyStats).map(([month, val]) => ({ month, val: val as number }))
    : [{ month: 'Current', val: 0 }];

  // Dynamic Asset Performance
  const uniqueAssets = Array.from(new Set(history.map(t => t.symbol)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
        <div className="flex bg-gray-800 rounded-lg p-1">
           {['all', 'month', 'week'].map(r => (
             <button 
               key={r}
               onClick={() => setTimeRange(r as any)} 
               className={`px-4 py-1.5 rounded-md text-sm capitalize ${timeRange === r ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'}`}
             >
               {r}
             </button>
           ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-card border border-card-border p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64} /></div>
            <div className="text-sm text-gray-400 uppercase font-semibold mb-2">Net Profit</div>
            <div className={`text-3xl font-mono font-bold ${netPnL >= 0 ? 'text-success' : 'text-danger'}`}>
              {netPnL > 0 ? '+' : ''}{netPnL.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-2">All time realized P&L</div>
         </div>

         <div className="bg-card border border-card-border p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><PieChart size={64} /></div>
            <div className="text-sm text-gray-400 uppercase font-semibold mb-2">Win Rate</div>
            <div className="text-3xl font-mono font-bold text-blue-400">{winRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-2">{wins.length} Wins / {losses.length} Losses</div>
         </div>

         <div className="bg-card border border-card-border p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={64} /></div>
            <div className="text-sm text-gray-400 uppercase font-semibold mb-2">Profit Factor</div>
            <div className="text-3xl font-mono font-bold text-white">{profitFactor.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-2">Gross Profit / Gross Loss</div>
         </div>

         <div className="bg-card border border-card-border p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart2 size={64} /></div>
            <div className="text-sm text-gray-400 uppercase font-semibold mb-2">Total Trades</div>
            <div className="text-3xl font-mono font-bold text-white">{totalTrades}</div>
            <div className="text-xs text-gray-500 mt-2">Avg trade: ${(totalTrades > 0 ? netPnL/totalTrades : 0).toFixed(2)}</div>
         </div>
      </div>

      {/* Equity Curve Chart (SVG) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-card-border p-6 rounded-xl">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-primary"/> Equity Curve</h3>
           <div className="h-64 w-full flex items-end justify-between gap-1 relative border-b border-l border-gray-700 px-2 pb-2">
              {/* Simple SVG Line Chart */}
              {totalTrades === 0 ? (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                    No trades yet. Start trading to see your performance curve.
                 </div>
              ) : (
                <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
                   <polyline 
                     points={equityCurvePoints.map((val, i) => {
                        const x = (i / (equityCurvePoints.length - 1)) * 100;
                        // Normalize y to 0-100%
                        const y = 100 - ((val - minVal) / (range || 1)) * 100; 
                        return `${x}%,${y}%`;
                     }).join(' ')}
                     fill="none"
                     stroke="#2962ff"
                     strokeWidth="3"
                     strokeLinecap="round"
                     vectorEffect="non-scaling-stroke"
                   />
                </svg>
              )}
              
              {/* Bars Overlay for visibility tooltips (only if data exists) */}
              {totalTrades > 0 && equityCurvePoints.map((val, i) => (
                 <div key={i} className="group relative w-full h-full">
                    <div className="absolute bottom-0 w-full hover:bg-white/5 transition-colors h-full"></div>
                    {/* Tooltip */}
                    <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-xs px-2 py-1 rounded border border-gray-700 whitespace-nowrap z-10">
                       {i === 0 ? 'Start' : `Trade ${i}`}: ${val.toFixed(2)}
                    </div>
                 </div>
              ))}
           </div>
           <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Start</span>
              <span>Trades Over Time</span>
              <span>Current</span>
           </div>
        </div>

        <div className="bg-card border border-card-border p-6 rounded-xl">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Calendar className="text-purple-400"/> Monthly Breakdown</h3>
           
           <div className="space-y-4">
              {monthlyData.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">No monthly data available.</div>
              )}
              {monthlyData.map((m, i) => (
                 <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                       <span className="text-gray-400">{m.month}</span>
                       <span className={m.val >= 0 ? 'text-success' : 'text-danger'}>${m.val.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                       <div 
                         className={`h-full ${m.val >= 0 ? 'bg-success' : 'bg-danger'}`} 
                         style={{ width: `${Math.abs(m.val) > 0 ? Math.min(100, (Math.abs(m.val)/1000)*100) : 0}%` }} 
                       ></div>
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="mt-8 pt-6 border-t border-gray-800">
             <h4 className="text-sm font-bold text-gray-400 mb-3">Asset Performance</h4>
             <div className="flex flex-wrap gap-2">
                {uniqueAssets.length === 0 && <span className="text-xs text-gray-600">No assets traded yet.</span>}
                {uniqueAssets.map(asset => (
                  <span key={asset} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                    {asset}
                  </span>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
