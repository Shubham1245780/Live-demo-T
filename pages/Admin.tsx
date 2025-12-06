
import React from 'react';
import { useStore } from '../store';
import { ShieldCheck, Users, Server, AlertTriangle, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Admin = () => {
  const { user, getAllUsers } = useStore();
  const mockUsers = getAllUsers();

  if (user?.role !== 'admin') {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">You do not have permission to view the Admin Panel.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-purple-900/20 border-b border-purple-500/20 py-8 px-4 sm:px-8">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <ShieldCheck className="text-purple-400" /> Admin Dashboard
              </h1>
              <p className="text-purple-300 mt-1">System Management & User Overview</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
               </span>
               <span className="text-sm font-mono text-success">System Online</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-card border border-card-border p-6 rounded-xl flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg text-blue-400">
                <Users size={32} />
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase font-bold">Total Users</div>
                <div className="text-3xl font-bold text-white">1,248</div>
                <div className="text-xs text-green-400">+12% this week</div>
              </div>
           </div>
           
           <div className="bg-card border border-card-border p-6 rounded-xl flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-lg text-purple-400">
                <Server size={32} />
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase font-bold">Server Load</div>
                <div className="text-3xl font-bold text-white">24%</div>
                <div className="text-xs text-gray-500">Latency: 45ms</div>
              </div>
           </div>

           <div className="bg-card border border-card-border p-6 rounded-xl flex items-center gap-4">
              <div className="p-4 bg-yellow-500/10 rounded-lg text-yellow-400">
                <AlertTriangle size={32} />
              </div>
              <div>
                <div className="text-sm text-gray-400 uppercase font-bold">Active Reports</div>
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-xs text-gray-500">Requires attention</div>
              </div>
           </div>
        </div>

        {/* User Management Table */}
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
           <div className="p-6 border-b border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold">User Management</h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <Input placeholder="Search users..." className="pl-9 h-9" />
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-900/50 text-gray-400 border-b border-gray-800">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Balance</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                   {mockUsers.map((u, i) => (
                     <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white">{u.username}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs border ${u.role === 'admin' ? 'bg-purple-900/30 border-purple-800 text-purple-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-mono">${u.balance.toLocaleString()}</td>
                        <td className="p-4">
                           <span className="flex items-center gap-2 text-xs text-green-400">
                             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                             <MoreHorizontal size={16} />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
};
