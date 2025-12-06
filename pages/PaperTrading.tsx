
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { TVChart } from '../components/tradingview/TVChart';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { OrderSide, OrderType, OrderStatus, Position } from '../types';
import { AVAILABLE_LEVERAGE, DEFAULT_SYMBOLS, MOCK_MARKET_DATA } from '../constants';
import { AlertCircle, TrendingUp, History, XCircle, RefreshCw, Wifi, PieChart, Pencil, Check, X } from 'lucide-react';

export const PaperTrading = () => {
  const { user, isAuthenticated, login, placeOrder, closePosition, updatePosition, cancelOrder, resetAccount } = useStore();
  
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [orderType, setOrderType] = useState<OrderType>(OrderType.MARKET);
  const [side, setSide] = useState<OrderSide>(OrderSide.BUY);
  const [quantity, setQuantity] = useState<number>(0.1);
  const [price, setPrice] = useState<number>(0); 
  const [leverage, setLeverage] = useState<number>(1);
  
  // New TP/SL State
  const [takeProfit, setTakeProfit] = useState<number | ''>('');
  const [stopLoss, setStopLoss] = useState<number | ''>('');

  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history' | 'analytics'>('positions');
  
  const [simulatedPrice, setSimulatedPrice] = useState(0);
  const [isLivePrice, setIsLivePrice] = useState(false);
  const [priceSource, setPriceSource] = useState<'Live API' | 'Simulated'>('Simulated');

  // Edit Position Modal State
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [editTP, setEditTP] = useState<string>('');
  const [editSL, setEditSL] = useState<string>('');

  // Fetch Price Logic & TP/SL Check Loop
  useEffect(() => {
    let isMounted = true;
    
    const fetchPriceAndCheckPositions = async () => {
      let currentPrice = 0;
      let isReal = false;
      
      let cleanSymbol = selectedSymbol.toUpperCase().trim();
      if (cleanSymbol.includes(':')) cleanSymbol = cleanSymbol.split(':')[1];

      // 1. Fetch Price (Binance or Mock)
      const isCryptoLikely = cleanSymbol.endsWith('USDT') || cleanSymbol.endsWith('USD') || cleanSymbol.endsWith('BTC') || cleanSymbol.endsWith('ETH');
      
      if (isCryptoLikely) {
        try {
          let res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${cleanSymbol}`);
          if (!res.ok && !cleanSymbol.includes('USDT')) {
             res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${cleanSymbol}USDT`);
          }
          if (res.ok) {
            const data = await res.json();
            currentPrice = parseFloat(data.price);
            isReal = true;
          }
        } catch (e) { /* silent fail */ }
      }

      if (currentPrice === 0) {
        const mock = MOCK_MARKET_DATA.find(m => m.symbol === cleanSymbol);
        if (mock) {
          const variation = (Math.random() - 0.5) * (mock.price * 0.002);
          currentPrice = mock.price + variation;
        } else {
           const hash = cleanSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
           const base = (hash % 500) + 50;
           const variation = (Math.random() - 0.5) * (base * 0.005);
           currentPrice = base + variation;
        }
        isReal = false;
      }

      if (isMounted && currentPrice > 0) {
        setSimulatedPrice(Number(currentPrice.toFixed(2)));
        setIsLivePrice(isReal);
        setPriceSource(isReal ? 'Live API' : 'Simulated');

        // 2. CHECK TP/SL TRIGGERS (Simple client-side check for current selected symbol)
        // Checks all positions matching the current symbol
        if (user?.positions) {
          user.positions.forEach(pos => {
            if (pos.symbol === selectedSymbol.toUpperCase()) {
              // Check Take Profit
              if (pos.takeProfit && pos.takeProfit > 0) {
                if ((pos.side === OrderSide.BUY && currentPrice >= pos.takeProfit) ||
                    (pos.side === OrderSide.SELL && currentPrice <= pos.takeProfit)) {
                    closePosition(pos.id, currentPrice, 'TP');
                }
              }
              // Check Stop Loss
              if (pos.stopLoss && pos.stopLoss > 0) {
                 if ((pos.side === OrderSide.BUY && currentPrice <= pos.stopLoss) ||
                     (pos.side === OrderSide.SELL && currentPrice >= pos.stopLoss)) {
                     closePosition(pos.id, currentPrice, 'SL');
                 }
              }
            }
          });
        }
      }
    };

    fetchPriceAndCheckPositions();
    const interval = setInterval(fetchPriceAndCheckPositions, 2000); // 2s polling
    return () => { isMounted = false; clearInterval(interval); };
  }, [selectedSymbol, user?.positions]);

  useEffect(() => {
    if (orderType === OrderType.LIMIT && simulatedPrice > 0) {
      setPrice(simulatedPrice);
    }
  }, [orderType]);

  const handlePlaceOrder = () => {
    if (!isAuthenticated) return alert("Please login first.");
    if (simulatedPrice === 0) return alert("Initializing price data...");

    placeOrder({
      symbol: selectedSymbol.toUpperCase(),
      side,
      type: orderType,
      quantity: Number(quantity),
      price: orderType === OrderType.MARKET ? simulatedPrice : Number(price),
      leverage: Number(leverage),
      takeProfit: takeProfit === '' ? undefined : Number(takeProfit),
      stopLoss: stopLoss === '' ? undefined : Number(stopLoss),
    });
    
    // Reset optional fields
    setTakeProfit('');
    setStopLoss('');
  };

  const openEditModal = (pos: Position) => {
    setEditingPosition(pos);
    setEditTP(pos.takeProfit?.toString() || '');
    setEditSL(pos.stopLoss?.toString() || '');
  };

  const handleSaveEdit = () => {
    if (editingPosition) {
      updatePosition(editingPosition.id, {
        takeProfit: editTP ? Number(editTP) : undefined,
        stopLoss: editSL ? Number(editSL) : undefined
      });
      setEditingPosition(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-card p-8 rounded-xl border border-card-border shadow-xl">
           <h2 className="text-2xl font-bold">Paper Trading Simulator</h2>
           <p className="text-gray-400">Log in to access your virtual portfolio with $100,000 USD demo funds.</p>
           <Button onClick={() => login('demo@novatradeview.com')} size="lg" fullWidth>Start Demo Account</Button>
        </div>
      </div>
    );
  }

  // Stats Calculation
  const history = user?.history || [];
  const totalTrades = history.length;
  const winningTrades = history.filter(t => t.realizedPL > 0).length;
  const losingTrades = history.filter(t => t.realizedPL < 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalProfit = history.filter(t => t.realizedPL > 0).reduce((acc, t) => acc + t.realizedPL, 0);
  const totalLoss = history.filter(t => t.realizedPL < 0).reduce((acc, t) => acc + t.realizedPL, 0); // Negative number
  const netPL = totalProfit + totalLoss;
  const profitFactor = Math.abs(totalLoss) > 0 ? totalProfit / Math.abs(totalLoss) : totalProfit > 0 ? 999 : 0;

  const accountEquity = user ? user.balance + user.positions.reduce((acc, pos) => {
     const currentPrice = pos.symbol === selectedSymbol ? simulatedPrice : pos.entryPrice; 
     const diff = pos.side === OrderSide.BUY ? currentPrice - pos.entryPrice : pos.entryPrice - currentPrice;
     return acc + (diff * pos.size);
  }, 0) : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] overflow-hidden lg:overflow-hidden relative">
      
      {/* LEFT: CHART (Fixed height on mobile, full flex on desktop) */}
      <div className="w-full lg:flex-1 h-[400px] lg:h-full border-b lg:border-b-0 lg:border-r border-card-border bg-black relative flex-shrink-0">
         <TVChart key={selectedSymbol} symbol={selectedSymbol} theme="dark" />
      </div>

      {/* RIGHT: INTERFACE (Scrollable on desktop and mobile) */}
      <div className="w-full lg:w-[450px] bg-card flex flex-col h-auto lg:h-full overflow-y-auto">
        
        {/* Header Stats */}
        <div className="p-4 border-b border-card-border bg-gray-900/50 sticky top-0 z-10 backdrop-blur-md">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Account Equity</span>
             <Button variant="ghost" size="sm" onClick={resetAccount} className="text-xs text-red-400 hover:text-red-300 h-6">
               <RefreshCw size={12} className="mr-1"/> Reset
             </Button>
           </div>
           <div className="text-3xl font-mono font-bold text-white mb-2">
             ${accountEquity.toLocaleString(undefined, {minimumFractionDigits: 2})}
           </div>
           <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-800/30 p-2 rounded">
             <div><span>Cash:</span> <span className="text-gray-300 font-mono">${user?.balance.toLocaleString()}</span></div>
             <div className="text-right">
                <span className={`font-mono font-bold text-lg ${isLivePrice ? 'text-primary' : 'text-yellow-500'}`}>
                  {simulatedPrice > 0 ? simulatedPrice : '---'}
                </span>
             </div>
           </div>
        </div>

        {/* Order Form */}
        <div className="p-4 space-y-4 border-b border-card-border bg-card">
           <div className="flex gap-2">
              <Button fullWidth variant={side === OrderSide.BUY ? 'success' : 'secondary'} className={side === OrderSide.BUY ? 'ring-2 ring-success' : 'opacity-70'} onClick={() => setSide(OrderSide.BUY)}>Buy</Button>
              <Button fullWidth variant={side === OrderSide.SELL ? 'danger' : 'secondary'} className={side === OrderSide.SELL ? 'ring-2 ring-danger' : 'opacity-70'} onClick={() => setSide(OrderSide.SELL)}>Sell</Button>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Symbol</label>
                <input list="paper-symbols" value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary uppercase" />
                <datalist id="paper-symbols">{DEFAULT_SYMBOLS.map(s => <option key={s} value={s} />)}</datalist>
              </div>

              <Select label="Type" value={orderType} onChange={(e) => setOrderType(e.target.value as OrderType)}>
                 <option value={OrderType.MARKET}>Market</option>
                 <option value={OrderType.LIMIT}>Limit</option>
              </Select>
              
              <Input label="Qty" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0.001} step={0.001} />
              
              <Input label="Price" type="number" value={orderType === OrderType.MARKET ? simulatedPrice : price} disabled={orderType === OrderType.MARKET} onChange={(e) => setPrice(Number(e.target.value))} className={orderType === OrderType.MARKET ? "opacity-60" : ""} />
              
              <Select label="Leverage" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))}>
                 {AVAILABLE_LEVERAGE.map(x => <option key={x} value={x}>{x}x</option>)}
              </Select>
           </div>
           
           {/* TP / SL Inputs */}
           <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
              <Input label="Take Profit (Optional)" placeholder="TP Price" type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} />
              <Input label="Stop Loss (Optional)" placeholder="SL Price" type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
           </div>

           <Button fullWidth size="lg" onClick={handlePlaceOrder} variant={side === OrderSide.BUY ? 'success' : 'danger'} className="mt-2">
             {side} {selectedSymbol}
           </Button>
        </div>

        {/* Tabs */}
        <div className="flex-1 flex flex-col min-h-[300px]">
           <div className="flex border-b border-card-border bg-gray-900/30 overflow-x-auto no-scrollbar">
              {['positions', 'orders', 'history', 'analytics'].map(tab => (
                <button 
                  key={tab}
                  className={`flex-1 py-3 px-4 text-xs font-medium uppercase whitespace-nowrap ${activeTab === tab ? 'text-primary border-b-2 border-primary bg-gray-800/50' : 'text-gray-400'}`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab}
                </button>
              ))}
           </div>

           <div className="flex-1 p-4 space-y-3 bg-card">
              {activeTab === 'positions' && (
                 <>
                   {user?.positions.length === 0 && <div className="text-center text-gray-500 text-sm mt-8 flex flex-col items-center"><TrendingUp size={32} className="mb-2 opacity-50"/>No positions</div>}
                   {user?.positions.map((pos, idx) => {
                      const currentP = pos.symbol === selectedSymbol ? simulatedPrice : pos.entryPrice;
                      const pnl = (pos.side === OrderSide.BUY ? 1 : -1) * (currentP - pos.entryPrice) * pos.size;
                      const pnlPercent = (pnl / ((pos.entryPrice * pos.size)/pos.leverage)) * 100;
                      
                      return (
                        <div key={pos.id || idx} className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50 shadow-sm relative group">
                           <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${pos.side === OrderSide.BUY ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>{pos.side}</span>
                                <span className="font-bold text-sm text-white">{pos.symbol}</span>
                                <span className="text-xs text-gray-500">x{pos.leverage}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditModal(pos)} className="p-1.5 bg-gray-700 rounded text-gray-300 hover:text-white" title="Edit TP/SL">
                                  <Pencil size={14} />
                                </button>
                                {/* UPDATED: Pass Position ID instead of Symbol */}
                                <button onClick={() => closePosition(pos.id, simulatedPrice, 'Manual')} className="p-1.5 bg-red-900/30 hover:bg-red-900/60 rounded text-red-400 hover:text-red-200" title="Close Trade">
                                  <X size={14} />
                                </button>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-2">
                             <div>Size: <span className="text-gray-200">{pos.size}</span></div>
                             <div>Entry: <span className="text-gray-200">{pos.entryPrice.toFixed(2)}</span></div>
                             <div>TP: <span className="text-gray-200">{pos.takeProfit || '-'}</span></div>
                             <div>SL: <span className="text-gray-200">{pos.stopLoss || '-'}</span></div>
                           </div>
                           <div className="pt-2 border-t border-gray-700 flex justify-between">
                              <span className="text-xs text-gray-500">Unrealized P&L</span>
                              <span className={`font-mono font-bold text-sm ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                {pnl > 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                              </span>
                           </div>
                        </div>
                      )
                   })}
                 </>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-xs text-gray-500 uppercase">Net P&L</div>
                      <div className={`text-xl font-bold font-mono ${netPL >= 0 ? 'text-success' : 'text-danger'}`}>
                        {netPL > 0 ? '+' : ''}{netPL.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-xs text-gray-500 uppercase">Win Rate</div>
                      <div className="text-xl font-bold text-primary">{winRate.toFixed(1)}%</div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-xs text-gray-500 uppercase">Profit Factor</div>
                      <div className="text-xl font-bold text-white">{profitFactor.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                      <div className="text-xs text-gray-500 uppercase">Total Trades</div>
                      <div className="text-xl font-bold text-white">{totalTrades}</div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-white mb-3">Performance Breakdown</h3>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs">
                          <span className="text-success">Winning Trades</span>
                          <span>{winningTrades}</span>
                       </div>
                       <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-success h-full" style={{ width: `${winRate}%` }}></div>
                       </div>
                       <div className="flex justify-between text-xs">
                          <span className="text-danger">Losing Trades</span>
                          <span>{losingTrades}</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                 <>
                  {user?.orders.filter(o => o.status === OrderStatus.OPEN).length === 0 && <div className="text-center text-gray-500 text-sm mt-8">No open orders</div>}
                  {user?.orders.filter(o => o.status === OrderStatus.OPEN).map(order => (
                     <div key={order.id} className="bg-gray-800/40 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                        <div>
                           <div className="text-sm font-bold text-white mb-1">{order.symbol} <span className="text-xs font-normal text-gray-400 bg-gray-900 px-1 rounded">{order.type}</span></div>
                           <div className={`text-xs ${order.side === OrderSide.BUY ? 'text-success' : 'text-danger'}`}>{order.side} {order.quantity} @ {order.price}</div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => cancelOrder(order.id)} className="h-7 text-xs">Cancel</Button>
                     </div>
                  ))}
                 </>
              )}
              
              {activeTab === 'history' && (
                 <>
                   {user?.history.length === 0 && <div className="text-center text-gray-500 text-sm mt-8">History empty</div>}
                   {user?.history.slice(0, 50).map(trade => (
                     <div key={trade.id} className="bg-gray-800/30 p-2 rounded border border-gray-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-white">{trade.symbol} <span className="font-normal text-gray-500">({trade.reason || 'Manual'})</span></div>
                          <div className="text-gray-500">{new Date(trade.timestamp).toLocaleString()}</div>
                        </div>
                        <div className={`font-mono font-bold ${trade.realizedPL >= 0 ? 'text-success' : 'text-danger'}`}>
                           {trade.realizedPL > 0 ? '+' : ''}{trade.realizedPL.toFixed(2)}
                        </div>
                     </div>
                   ))}
                 </>
              )}
           </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingPosition && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border border-card-border p-6 rounded-lg shadow-2xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-white">Edit Position: {editingPosition.symbol}</h3>
            <div className="space-y-4">
               <Input label="Take Profit Price" type="number" placeholder="No TP" value={editTP} onChange={(e) => setEditTP(e.target.value)} />
               <Input label="Stop Loss Price" type="number" placeholder="No SL" value={editSL} onChange={(e) => setEditSL(e.target.value)} />
               <div className="flex gap-2 pt-2">
                 <Button fullWidth variant="secondary" onClick={() => setEditingPosition(null)}>Cancel</Button>
                 <Button fullWidth onClick={handleSaveEdit}>Update</Button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
