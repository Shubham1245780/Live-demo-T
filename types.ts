
export enum OrderSide {
  BUY = 'Buy',
  SELL = 'Sell',
}

export enum OrderType {
  MARKET = 'Market',
  LIMIT = 'Limit',
}

export enum OrderStatus {
  OPEN = 'Open',
  FILLED = 'Filled',
  CANCELLED = 'Cancelled',
}

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number; // For limit orders, or execution price for market
  quantity: number;
  leverage: number;
  takeProfit?: number;
  stopLoss?: number;
  status: OrderStatus;
  timestamp: number;
}

export interface Position {
  id: string; // Added unique ID for easier updates
  symbol: string;
  side: OrderSide;
  size: number;
  entryPrice: number;
  leverage: number;
  takeProfit?: number;
  stopLoss?: number;
  unrealizedPL?: number;
}

export interface TradeHistory {
  id: string;
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
  realizedPL: number;
  timestamp: number;
  reason?: 'Manual' | 'TP' | 'SL';
}

export interface JournalEntry {
  id: string;
  date: number;
  title: string;
  symbol: string;
  content: string;
  tags: string[];
  sentiment: 'excited' | 'confident' | 'neutral' | 'anxious' | 'frustrated';
  images?: string[]; // URLs
  
  // New Advanced Fields
  strategy?: string;
  entryPrice?: number;
  exitPrice?: number;
  leverage?: number;
  pnl?: number;
  capitalUsed?: number;
  timeframe?: string;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  username: string;
  email: string;
  role: UserRole;
  balance: number;
  currency: string;
  positions: Position[];
  orders: Order[];
  history: TradeHistory[];
  journal: JournalEntry[];
  watchlist: string[];
  settings: {
    theme: 'light' | 'dark';
    defaultLeverage: number;
  };
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: string;
}

export interface AdminStats {
  totalUsers: number;
  totalVolume: number;
  activeSessions: number;
  systemHealth: 'Healthy' | 'Degraded' | 'Down';
}
