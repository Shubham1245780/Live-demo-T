
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderSide, OrderStatus, OrderType, Position, TradeHistory, UserProfile, JournalEntry, UserRole } from './types';
import { INITIAL_BALANCE } from './constants';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Paper Trading Actions
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp'>) => void;
  updatePosition: (positionId: string, updates: Partial<Position>) => void;
  cancelOrder: (orderId: string) => void;
  closePosition: (positionId: string, price: number, reason?: 'Manual' | 'TP' | 'SL') => void;
  resetAccount: () => void;
  
  // Journal
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  deleteJournalEntry: (id: string) => void;

  // Watchlist
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;

  // Admin Actions (Mock)
  getAllUsers: () => UserProfile[]; // For admin panel demo
}

// Helper to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Users Generator for Admin Panel
const generateMockUsers = (): UserProfile[] => {
  return Array.from({ length: 12 }).map((_, i) => ({
    username: `Trader_${Math.floor(Math.random() * 9999)}`,
    email: `user${i}@example.com`,
    role: 'user',
    balance: 100000 + (Math.random() * 50000 - 25000),
    currency: 'USD',
    positions: [],
    orders: [],
    history: [],
    journal: [],
    watchlist: [],
    settings: { theme: 'dark', defaultLeverage: 1 }
  }));
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      login: (email) => {
        const isAdmin = email.toLowerCase().includes('admin');
        set({
          isAuthenticated: true,
          user: {
            email,
            username: email.split('@')[0],
            role: isAdmin ? 'admin' : 'user',
            balance: INITIAL_BALANCE,
            currency: 'USD',
            positions: [],
            orders: [],
            history: [],
            journal: [],
            watchlist: ['BTCUSDT', 'AAPL', 'EURUSD'],
            settings: { theme: 'dark', defaultLeverage: 1 }
          }
        });
      },

      logout: () => set({ isAuthenticated: false, user: null }),

      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      placeOrder: (newOrder) => set((state) => {
        if (!state.user) return state;
        const totalCost = (newOrder.price * newOrder.quantity) / newOrder.leverage;
        
        // Basic validation
        if (newOrder.type === OrderType.MARKET && totalCost > state.user.balance) {
          alert("Insufficient funds for this trade.");
          return state;
        }

        const order: Order = {
          ...newOrder,
          id: generateId(),
          status: newOrder.type === OrderType.MARKET ? OrderStatus.FILLED : OrderStatus.OPEN,
          timestamp: Date.now(),
        };

        let updatedUser = { ...state.user };

        if (order.status === OrderStatus.FILLED) {
          // HEDGING MODE: Always create a new separate position for every filled order.
          // We do NOT check for existing positions to merge or reduce.
          updatedUser.positions.push({
            id: generateId(),
            symbol: order.symbol,
            side: order.side,
            size: order.quantity,
            entryPrice: order.price,
            leverage: order.leverage,
            takeProfit: order.takeProfit,
            stopLoss: order.stopLoss
          });
        }

        updatedUser.orders = [order, ...updatedUser.orders];
        return { user: updatedUser };
      }),

      updatePosition: (positionId, updates) => set((state) => {
        if (!state.user) return state;
        const updatedPositions = state.user.positions.map(p => 
          p.id === positionId ? { ...p, ...updates } : p
        );
        return { user: { ...state.user, positions: updatedPositions } };
      }),

      cancelOrder: (orderId) => set((state) => {
        if (!state.user) return state;
        const updatedOrders = state.user.orders.map(o => 
          o.id === orderId ? { ...o, status: OrderStatus.CANCELLED } : o
        );
        return { user: { ...state.user, orders: updatedOrders }};
      }),

      closePosition: (positionId, currentPrice, reason: 'Manual' | 'TP' | 'SL' = 'Manual') => set((state) => {
        if (!state.user) return state;
        
        // Find position by unique ID (allows multiple positions per symbol)
        const posIndex = state.user.positions.findIndex(p => p.id === positionId);
        if (posIndex === -1) return state;

        const pos = state.user.positions[posIndex];
        const realizedPL = (pos.side === OrderSide.BUY ? 1 : -1) * (currentPrice - pos.entryPrice) * pos.size;
        
        const historyEntry: TradeHistory = {
          id: generateId(),
          symbol: pos.symbol,
          side: pos.side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY,
          price: currentPrice,
          quantity: pos.size,
          realizedPL,
          timestamp: Date.now(),
          reason
        };

        return {
          user: {
            ...state.user,
            balance: state.user.balance + realizedPL,
            positions: state.user.positions.filter(p => p.id !== positionId), // Remove specific position by ID
            history: [historyEntry, ...state.user.history]
          }
        };
      }),

      resetAccount: () => set((state) => {
         if(!state.user) return state;
         return {
           user: {
             ...state.user,
             balance: INITIAL_BALANCE,
             positions: [],
             orders: [],
             history: [],
             journal: []
           }
         };
      }),

      addJournalEntry: (entry) => set((state) => {
        if (!state.user) return state;
        const newEntry: JournalEntry = {
          ...entry,
          id: generateId(),
          date: Date.now()
        };
        return { user: { ...state.user, journal: [newEntry, ...state.user.journal] } };
      }),

      deleteJournalEntry: (id) => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, journal: state.user.journal.filter(j => j.id !== id) } };
      }),

      addToWatchlist: (symbol) => set((state) => {
        if (!state.user || state.user.watchlist.includes(symbol)) return state;
        return { user: { ...state.user, watchlist: [...state.user.watchlist, symbol] } };
      }),

      removeFromWatchlist: (symbol) => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, watchlist: state.user.watchlist.filter(s => s !== symbol) } };
      }),

      getAllUsers: () => generateMockUsers()
    }),
    {
      name: 'novatradeview-storage',
    }
  )
);
