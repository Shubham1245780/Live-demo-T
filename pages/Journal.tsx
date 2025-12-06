
import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { JournalEntry } from '../types';
import { Trash2, Plus, Smile, Frown, Meh, AlertCircle, BookOpen, Calculator } from 'lucide-react';

export const Journal = () => {
  const { user, addJournalEntry, deleteJournalEntry, isAuthenticated } = useStore();
  
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [symbol, setSymbol] = useState('');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState<JournalEntry['sentiment']>('neutral');
  const [tags, setTags] = useState('');

  // Advanced Fields
  const [strategy, setStrategy] = useState('Trend Following');
  const [timeframe, setTimeframe] = useState('15m');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [exitPrice, setExitPrice] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
  
  // Computed for preview
  const calculatedPnL = entryPrice && exitPrice && size 
    ? (direction === 'Long' ? (Number(exitPrice) - Number(entryPrice)) : (Number(entryPrice) - Number(exitPrice))) * Number(size)
    : 0;

  const handleSubmit = () => {
    if (!title) return alert("Title is required");
    
    addJournalEntry({
      title,
      symbol: symbol.toUpperCase(),
      content,
      sentiment,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      strategy,
      timeframe,
      entryPrice: entryPrice ? Number(entryPrice) : undefined,
      exitPrice: exitPrice ? Number(exitPrice) : undefined,
      pnl: calculatedPnL,
      capitalUsed: (Number(entryPrice) * Number(size)), 
      leverage: 1 // simplified for manual entry
    });

    // Reset
    setTitle('');
    setSymbol('');
    setContent('');
    setSentiment('neutral');
    setTags('');
    setEntryPrice('');
    setExitPrice('');
    setSize('');
    setShowForm(false);
  };

  const getSentimentIcon = (s: string) => {
    switch(s) {
      case 'excited': return <Smile className="text-green-400" />;
      case 'confident': return <Smile className="text-blue-400" />;
      case 'anxious': return <AlertCircle className="text-orange-400" />;
      case 'frustrated': return <Frown className="text-red-400" />;
      default: return <Meh className="text-gray-400" />;
    }
  };

  // Mini Stats for Journal
  const journalEntries = user?.journal || [];
  const totalPnL = journalEntries.reduce((acc, curr) => acc + (curr.pnl || 0), 0);
  const totalWins = journalEntries.filter(j => (j.pnl || 0) > 0).length;
  const winRate = journalEntries.length > 0 ? (totalWins / journalEntries.length) * 100 : 0;

  if (!isAuthenticated) {
     return <div className="p-12 text-center text-gray-500">Please log in to view your trading journal.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold flex items-center gap-2"><BookOpen className="text-primary"/> Trading Journal</h1>
           <p className="text-gray-400 mt-1">Record your thoughts, emotions, and lessons.</p>
        </div>
        
        {/* Quick Stats Header */}
        <div className="flex gap-4 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
           <div className="px-4 border-r border-gray-700">
              <div className="text-xs text-gray-400 uppercase">Journal P&L</div>
              <div className={`font-mono font-bold ${totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>${totalPnL.toFixed(2)}</div>
           </div>
           <div className="px-4">
              <div className="text-xs text-gray-400 uppercase">Log Win Rate</div>
              <div className="font-bold text-blue-400">{winRate.toFixed(1)}%</div>
           </div>
        </div>

        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
           {showForm ? 'Cancel' : <><Plus size={18}/> New Entry</>}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-card-border p-6 rounded-xl mb-8 shadow-lg animate-in fade-in slide-in-from-top-4">
           <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calculator size={18} className="text-primary"/> New Trade Analysis</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input label="Title / Headline" placeholder="e.g. BTC Breakout Strategy" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Input label="Symbol" placeholder="e.g. BTCUSDT" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              <Select label="Strategy" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                <option>Trend Following</option>
                <option>Breakout</option>
                <option>Mean Reversion</option>
                <option>Scalping</option>
                <option>Swing</option>
                <option>News Trading</option>
              </Select>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <div className="col-span-2 md:col-span-1">
                 <Select label="Direction" value={direction} onChange={(e) => setDirection(e.target.value as any)}>
                   <option value="Long">Long (Buy)</option>
                   <option value="Short">Short (Sell)</option>
                 </Select>
              </div>
              <Input label="Entry Price" type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} />
              <Input label="Exit Price" type="number" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} />
              <Input label="Size (Qty)" type="number" value={size} onChange={(e) => setSize(e.target.value)} />
              
              <div className="flex flex-col justify-end">
                <div className="text-xs text-gray-500 mb-1">Estimated P&L</div>
                <div className={`font-mono font-bold text-lg p-2 rounded bg-gray-800 text-center ${calculatedPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                   {calculatedPnL.toFixed(2)}
                </div>
              </div>
           </div>

           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-400 mb-1">Notes & Analysis</label>
             <textarea 
               className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px]"
               placeholder="Why did you take the trade? What happened? How did you feel?"
               value={content}
               onChange={(e) => setContent(e.target.value)}
             />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Select label="Emotion / Sentiment" value={sentiment} onChange={(e) => setSentiment(e.target.value as any)}>
                 <option value="neutral">Neutral</option>
                 <option value="confident">Confident</option>
                 <option value="excited">Excited</option>
                 <option value="anxious">Anxious</option>
                 <option value="frustrated">Frustrated</option>
              </Select>
              <Input label="Tags (comma separated)" placeholder="e.g. Mistake, FOMO, Perfect Setup" value={tags} onChange={(e) => setTags(e.target.value)} />
           </div>

           <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
             <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
             <Button onClick={handleSubmit}>Save Entry</Button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {journalEntries.length === 0 && (
           <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
             <BookOpen size={48} className="mx-auto mb-4 opacity-20"/>
             <p>No journal entries yet. Start writing to improve your trading!</p>
           </div>
         )}

         {journalEntries.map(entry => (
           <div key={entry.id} className="bg-card border border-card-border p-5 rounded-xl hover:border-primary/50 transition-all group relative flex flex-col">
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2">
                    {getSentimentIcon(entry.sentiment)}
                    <span className="text-xs text-gray-500 uppercase font-bold">{new Date(entry.date).toLocaleDateString()}</span>
                 </div>
                 <div className="flex gap-2">
                   {entry.strategy && <span className="bg-blue-900/30 text-blue-300 text-[10px] px-2 py-1 rounded font-bold border border-blue-900/50">{entry.strategy}</span>}
                   {entry.symbol && <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300 font-bold">{entry.symbol}</span>}
                 </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{entry.title}</h3>
              
              {/* Financials in Card */}
              {entry.pnl !== undefined && entry.pnl !== 0 && (
                 <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-900/50 p-2 rounded text-xs">
                    <div>
                      <span className="text-gray-500 block">P&L</span>
                      <span className={`font-mono font-bold ${entry.pnl > 0 ? 'text-success' : 'text-danger'}`}>
                        {entry.pnl > 0 ? '+' : ''}{entry.pnl}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Prices</span>
                      <span className="text-gray-300">{entry.entryPrice} → {entry.exitPrice}</span>
                    </div>
                 </div>
              )}

              <p className="text-sm text-gray-400 mb-4 line-clamp-4 whitespace-pre-wrap flex-1">{entry.content}</p>
              
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800">
                 <div className="flex gap-2 flex-wrap">
                    {entry.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                 </div>
                 <button onClick={() => deleteJournalEntry(entry.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1" title="Delete Entry">
                   <Trash2 size={16} />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
