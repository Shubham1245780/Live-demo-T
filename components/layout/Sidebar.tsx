
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, PieChart, Layers, FileText, Settings, Bookmark, Bell, BookOpen, Activity, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useStore();

  const links = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Markets', icon: <BarChart2 size={20} />, path: '/markets' },
    { name: 'Charts', icon: <Layers size={20} />, path: '/charts' },
    { name: 'Screener', icon: <PieChart size={20} />, path: '/screener' },
    { name: 'Paper Trading', icon: <FileText size={20} />, path: '/paper-trading' },
    { name: 'Journal', icon: <BookOpen size={20} />, path: '/journal' },
    { name: 'Analytics', icon: <Activity size={20} />, path: '/analytics' },
  ];

  const sidebarClass = `fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-card-border w-64 transform transition-transform duration-200 ease-in-out z-40 ${
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  }`;

  return (
    <aside className={sidebarClass}>
      <div className="p-4 space-y-2 h-full overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Menu
          </p>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {user?.role === 'admin' && (
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Administration
            </p>
            <Link
              to="/admin"
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-purple-500/10 text-purple-400 border-r-2 border-purple-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ShieldCheck size={20} />
              Admin Panel
            </Link>
          </div>
        )}

        <div className="mb-6">
           <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            User Tools
          </p>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Bookmark size={20} />
            <span>Watchlist</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer">
            <Bell size={20} />
            <span>Alerts</span>
          </div>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>

        {user && (
           <div className="mt-auto pt-6 border-t border-gray-800 px-4 pb-20">
              <p className="text-xs text-gray-500 mb-2">Quick Watchlist</p>
              <div className="space-y-2">
                {user.watchlist.slice(0, 5).map(symbol => (
                  <Link key={symbol} to={`/charts?symbol=${symbol}`} className="flex justify-between items-center text-sm text-gray-300 hover:text-white p-2 hover:bg-gray-800 rounded cursor-pointer">
                    <span>{symbol}</span>
                    <span className="text-xs text-gray-500">View</span>
                  </Link>
                ))}
              </div>
           </div>
        )}
      </div>
    </aside>
  );
};
