import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TVChart } from '../components/tradingview/TVChart';
import { TVTechnicalAnalysis } from '../components/tradingview/TVWidgets';
import { DEFAULT_SYMBOLS } from '../constants';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const Charts = () => {
  const query = useQuery();
  const urlSymbol = query.get('symbol');
  
  const [symbol, setSymbol] = useState(urlSymbol || 'BTCUSDT');
  const [layout, setLayout] = useState<'single' | 'split'>('single');

  useEffect(() => {
    if(urlSymbol) setSymbol(urlSymbol);
  }, [urlSymbol]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Chart Controls */}
      <div className="h-12 border-b border-card-border bg-card px-4 flex items-center gap-4">
        <div className="w-52 relative">
          <input
            list="symbol-suggestions"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="bg-gray-800 border border-gray-700 h-8 text-sm py-1 px-2 w-full rounded text-white focus:border-primary focus:outline-none placeholder-gray-500"
            placeholder="Symbol (e.g. AAPL)"
          />
          <datalist id="symbol-suggestions">
            {DEFAULT_SYMBOLS.map(s => <option key={s} value={s} />)}
          </datalist>
        </div>
        
        <div className="h-6 w-px bg-gray-700 mx-2"></div>
        
        <div className="flex bg-gray-800 rounded p-1">
           <button 
             onClick={() => setLayout('single')} 
             className={`px-3 py-1 text-xs rounded ${layout === 'single' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
           >
             Single
           </button>
           <button 
             onClick={() => setLayout('split')} 
             className={`px-3 py-1 text-xs rounded ${layout === 'split' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
           >
             Split View
           </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 ${layout === 'split' ? 'w-2/3' : 'w-full'} h-full relative`}>
            <TVChart key={symbol} symbol={symbol} />
        </div>
        
        {layout === 'split' && (
          <div className="w-1/3 border-l border-card-border bg-card">
             <div className="h-1/2 border-b border-card-border p-2">
                <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase">Tech Analysis</h3>
                <TVTechnicalAnalysis symbol={symbol} />
             </div>
             <div className="h-1/2 p-2">
               <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase">Second Chart (ETH)</h3>
               <TVChart symbol="ETHUSDT" interval="60" autosize={true} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
};