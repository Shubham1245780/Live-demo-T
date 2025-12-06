
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { Menu, X, Moon, Sun, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, theme, toggleTheme }) => {
  const { user, isAuthenticated, logout, login } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    // Simulated login for demo
    const email = prompt("Enter email for demo login:\n(Hint: use 'admin@novatradeview.com' for Admin Panel access)", "trader@example.com");
    if (email) login(email);
  };

  const navLinks = [
    { name: 'Markets', path: '/markets' },
    { name: 'Charts', path: '/charts' },
    { name: 'Screener', path: '/screener' },
    { name: 'Paper Trading', path: '/paper-trading' },
    { name: 'Docs', path: '/docs' },
  ];

  return (
    <header className="h-16 border-b border-card-border bg-card/50 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md hover:bg-gray-800 lg:hidden text-gray-300"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
            NovaTradeView
          </span>
        </Link>

        <nav className="hidden md:flex ml-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs text-gray-400">Balance</span>
            <span className="text-sm font-mono font-bold text-success">
              ${user?.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-yellow-400 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-700 transition-colors border ${user?.role === 'admin' ? 'bg-purple-900/30 border-purple-500/50' : 'bg-gray-800 border-gray-700'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary/20 text-primary'}`}>
                {user?.role === 'admin' ? <ShieldCheck size={16} /> : <User size={16} />}
              </div>
              <span className="text-xs font-medium max-w-[80px] truncate hidden sm:block">
                {user?.username}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-card-border rounded-lg shadow-xl py-1 z-50">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} /> Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-purple-300 hover:bg-purple-900/30 hover:text-white"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ShieldCheck size={16} /> Admin Panel
                  </Link>
                )}
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={handleLogin} size="sm">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};
