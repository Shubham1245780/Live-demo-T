export const APP_NAME = "NovaTradeView";

export const DEFAULT_SYMBOLS = [
  // Crypto
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "DOTUSDT", "MATICUSDT", "LTCUSDT",
  "SHIBUSDT", "TRXUSDT", "UNIUSDT", "LINKUSDT", "ATOMUSDT", "XLMUSDT", "BCHUSDT", "NEARUSDT", "ALGOUSDT", "FILUSDT",
  "HBARUSDT", "ICPUSDT", "ETCUSDT", "SANDUSDT", "MANAUSDT", "AAVEUSDT", "THETAUSDT", "EOSUSDT", "XTZUSDT", "AXSUSDT",
  // Forex
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD", "EURGBP", "EURJPY", "GBPJPY",
  "AUDJPY", "CADJPY", "CHFJPY", "NZDJPY", "GBPCHF", "EURAUD", "EURCAD", "AUDNZD", "AUDCAD", "GBPAUD",
  // Indices & Commodities
  "SPX500", "NAS100", "US30", "UK100", "DEU40", "FRA40", "JPN225", "AUS200", "XAUUSD", "XAGUSD", "WTI", "BRENT",
  // US Stocks (Tech/Popular)
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "BRK.B", "TSM", "UNH",
  "JNJ", "V", "WMT", "JPM", "PG", "MA", "LLY", "HD", "CVX", "MRK", "KO", "PEP", "ABBV", "BAC", "COST",
  "AMD", "NFLX", "INTC", "DIS", "NKE", "PYPL", "ADBE", "CRM", "CMCSA", "VZ", "T", "CSCO", "PFE", "XOM",
  "UBER", "ABNB", "PLTR", "COIN", "MSTR", "SQ", "SHOP", "ROKU", "ZM", "SNOW"
];

export const INITIAL_BALANCE = 100000;

export const AVAILABLE_LEVERAGE = [1, 2, 5, 10, 20, 50, 100];

// Updated prices to be closer to 2024/2025 reality for better fallback experience
export const MOCK_MARKET_DATA = [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 92450.50, change: 2.4, volume: "45.5B" },
  { symbol: "ETHUSDT", name: "Ethereum", price: 3450.20, change: 1.1, volume: "18.2B" },
  { symbol: "SOLUSDT", name: "Solana", price: 145.20, change: 8.2, volume: "5.2B" },
  { symbol: "XRPUSDT", name: "Ripple", price: 0.6205, change: -1.2, volume: "1.1B" },
  { symbol: "ADAUSDT", name: "Cardano", price: 0.45, change: -0.5, volume: "450M" },
  { symbol: "DOGEUSDT", name: "Dogecoin", price: 0.16, change: 5.4, volume: "1.2B" },
  { symbol: "AVAXUSDT", name: "Avalanche", price: 35.40, change: 2.1, volume: "300M" },
  
  { symbol: "EURUSD", name: "Euro / US Dollar", price: 1.0850, change: 0.1, volume: "105B" },
  { symbol: "GBPUSD", name: "GBP / US Dollar", price: 1.2650, change: -0.2, volume: "85B" },
  { symbol: "USDJPY", name: "US Dollar / Yen", price: 154.20, change: 0.4, volume: "90B" },
  { symbol: "XAUUSD", name: "Gold", price: 2380.50, change: 1.2, volume: "45B" },
  
  { symbol: "SPX500", name: "S&P 500", price: 5400.40, change: 0.8, volume: "N/A" },
  { symbol: "NAS100", name: "Nasdaq 100", price: 18900.20, change: 1.2, volume: "N/A" },
  { symbol: "US30", name: "Dow Jones 30", price: 40500.10, change: 0.5, volume: "N/A" },
  
  { symbol: "AAPL", name: "Apple Inc", price: 225.40, change: -0.5, volume: "4.1B" },
  { symbol: "MSFT", name: "Microsoft", price: 440.50, change: 1.1, volume: "3.5B" },
  { symbol: "NVDA", name: "NVIDIA Corp", price: 135.10, change: 4.5, volume: "35B" },
  { symbol: "TSLA", name: "Tesla Inc", price: 240.80, change: 3.2, volume: "8.5B" },
  { symbol: "AMZN", name: "Amazon", price: 195.20, change: 0.9, volume: "2.8B" },
  { symbol: "GOOGL", name: "Alphabet Inc", price: 180.50, change: 0.2, volume: "2.1B" },
  { symbol: "META", name: "Meta Platforms", price: 530.40, change: 2.1, volume: "3.1B" },
  { symbol: "COIN", name: "Coinbase", price: 265.30, change: 5.6, volume: "1.2B" },
  { symbol: "MSTR", name: "MicroStrategy", price: 1650.20, change: 12.4, volume: "900M" },
];