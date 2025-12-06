import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_MARKET_DATA } from '../constants';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Star, ExternalLink } from 'lucide-react';
import { useStore } from '../store';

export const Markets = () => {
  const [filter, setFilter] = useState('');
  const { addToWatchlist, user } = useStore();
  const navigate = useNavigate();
  
  const filteredData = MOCK_MARKET_DATA.filter(item => 
    item.symbol.toLowerCase().includes(filter.toLowerCase()) || 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCustomSymbol = () => {
    if (!filter) return;
    navigate(`/charts?symbol=${filter.toUpperCase()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Markets</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <Input 
            placeholder="Search any symbol (e.g. BTC, AAPL, FOREXCOM:SPXUSD)..." 
            className="pl-10"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCustomSymbol();
            }}
          />
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-sm border-b border-gray-800">
                <th className="p-4">Symbol</th>
                <th className="p-4">Name</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">24h Change</th>
                <th className="p-4 text-right">Volume</th>
                <th className="p-4 text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredData.map((asset) => (
                <tr key={asset.symbol} className="hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 font-bold text-white">
                    <Link to={`/charts?symbol=${asset.symbol}`} className="hover:text-primary transition-colors flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs">
                        {asset.symbol.slice(0, 1)}
                      </div>
                      {asset.symbol}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-400">{asset.name}</td>
                  <td className="p-4 text-right font-mono">${asset.price.toLocaleString()}</td>
                  <td className={`p-4 text-right font-medium ${asset.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {asset.change > 0 ? '+' : ''}{asset.change}%
                  </td>
                  <td className="p-4 text-right text-gray-400">{asset.volume}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => addToWatchlist(asset.symbol)}
                      className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${user?.watchlist.includes(asset.symbol) ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      <Star size={18} fill={user?.watchlist.includes(asset.symbol) ? "currentColor" : "none"} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Fallback for "Search All" */}
        {filteredData.length === 0 && filter && (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">
              Symbol "{filter}" not found in our popular list.
            </p>
            <Button onClick={handleCustomSymbol} className="gap-2">
              <ExternalLink size={16} />
              Open Chart for "{filter.toUpperCase()}"
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              You can search for any valid TradingView symbol (Stocks, Crypto, Forex, etc.)
            </p>
          </div>
        )}

        {filteredData.length === 0 && !filter && (
           <div className="p-8 text-center text-gray-500">
            No markets found.
          </div>
        )}
      </div>
      
      <p className="mt-4 text-xs text-center text-gray-600">
        * Market data on this specific list is simulated for demonstration. 
        Charts and Widgets use real-time TradingView data for ALL symbols.
      </p>
    </div>
  );
};