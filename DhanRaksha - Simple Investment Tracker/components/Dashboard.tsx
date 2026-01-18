import React, { useMemo } from 'react';
import { Investment } from '../types';
import InvestmentCard from './InvestmentCard';
import { getInvestmentStatus } from '../utils/dateUtils';
import { Plus, LayoutGrid, AlertTriangle } from 'lucide-react';

interface Props {
  investments: Investment[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (investment: Investment) => void;
}

const Dashboard: React.FC<Props> = ({ investments, onAdd, onDelete, onEdit }) => {
  
  const upcomingInvestments = useMemo(() => {
    return investments.filter(inv => {
      const status = getInvestmentStatus(inv);
      return status.isUrgent;
    });
  }, [investments]);

  const sortedInvestments = useMemo(() => {
    return [...investments].sort((a, b) => b.createdAt - a.createdAt);
  }, [investments]);

  if (investments.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <LayoutGrid className="text-slate-400 dark:text-slate-500" size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No investments added</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Your dashboard is empty. Add your first Fixed Deposit, SIP, or Insurance policy to start tracking.</p>
        <button 
          onClick={onAdd}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Add Investment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header with Add Button */}
      <div className="flex justify-between items-center pb-2">
          <div>
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Overview of your financial assets</p>
          </div>
          <button 
            onClick={onAdd} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Investment</span>
              <span className="sm:hidden">Add</span>
          </button>
      </div>

      {/* Upcoming Section */}
      {upcomingInvestments.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} />
              Upcoming Actions (Next 30 Days)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingInvestments.map(inv => (
              <InvestmentCard key={`dash-upcoming-${inv.id}`} data={inv} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </section>
      )}

      {/* All Investments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">All Investments</h2>
          <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">{investments.length} Total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedInvestments.map(inv => (
             <InvestmentCard key={inv.id} data={inv} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;