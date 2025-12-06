import React from 'react';
import { ShieldAlert, Book, HelpCircle } from 'lucide-react';

export const Docs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Documentation & Support</h1>
        <p className="text-gray-400">Everything you need to know about NovaTradeView and Paper Trading.</p>
      </div>

      <div className="space-y-12">
        <section className="bg-card border border-card-border p-8 rounded-xl">
           <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="text-primary" size={32} />
              <h2 className="text-2xl font-bold">Disclaimer</h2>
           </div>
           <p className="text-gray-300 leading-relaxed mb-4">
             NovaTradeView is a <strong>simulation platform</strong>. No real money is involved, and no actual financial trades are executed on any exchange. 
             All "funds" displayed are virtual demo credits.
           </p>
           <p className="text-gray-300 leading-relaxed">
             Market data provided in charts is real (via TradingView), but the Paper Trading execution engine uses a simulated matching system. 
             Execution prices in the simulation may differ slightly from real-world liquidity conditions.
           </p>
        </section>

        <section className="bg-card border border-card-border p-8 rounded-xl">
           <div className="flex items-center gap-3 mb-6">
              <Book className="text-success" size={32} />
              <h2 className="text-2xl font-bold">How Paper Trading Works</h2>
           </div>
           <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. The Wallet</h3>
                <p className="text-gray-400">Every new account starts with $100,000 USD in virtual equity. You can reset this at any time from the trading panel.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. Order Types</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li><strong>Market Orders:</strong> Execute immediately at the current simulated price.</li>
                  <li><strong>Limit Orders:</strong> Placed in the order book and only execute when the simulated price crosses your limit price.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">3. Leverage</h3>
                <p className="text-gray-400">
                  We allow you to simulate leverage up to 100x. Note that while leverage increases potential profit, it also increases the speed at which you can lose your virtual equity.
                </p>
              </div>
           </div>
        </section>

        <section className="bg-card border border-card-border p-8 rounded-xl">
           <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="text-purple-400" size={32} />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
           </div>
           <div className="space-y-4">
              <details className="bg-gray-800/50 rounded-lg p-4 cursor-pointer">
                 <summary className="font-medium text-white">Is the market data real?</summary>
                 <p className="mt-2 text-gray-400">Yes! The charts and widgets use real-time data provided by TradingView. However, the 'Market List' page uses simulated data snapshot for demonstration stability.</p>
              </details>
              <details className="bg-gray-800/50 rounded-lg p-4 cursor-pointer">
                 <summary className="font-medium text-white">Can I withdraw my profits?</summary>
                 <p className="mt-2 text-gray-400">No. This is strictly a paper trading (educational) platform. The money is virtual.</p>
              </details>
              <details className="bg-gray-800/50 rounded-lg p-4 cursor-pointer">
                 <summary className="font-medium text-white">Why did my limit order not fill?</summary>
                 <p className="mt-2 text-gray-400">In our simulation, limit orders fill when the random price fluctuation crosses your target. If the price hasn't moved enough, it stays open.</p>
              </details>
           </div>
        </section>
      </div>
    </div>
  );
};