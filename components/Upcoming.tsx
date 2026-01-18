import React from 'react';
import { Investment } from '../types';
import InvestmentCard from './InvestmentCard';
import { getInvestmentStatus } from '../utils/dateUtils';
import { BellRing, CheckCircle2 } from 'lucide-react';

interface Props {
  investments: Investment[];
  onDelete: (id: string) => void;
  onEdit: (investment: Investment) => void;
}

const Upcoming: React.FC<Props> = ({ investments, onDelete, onEdit }) => {
  const upcomingInvestments = investments.filter(inv => {
    const status = getInvestmentStatus(inv);
    return status.isUrgent;
  }).sort((a, b) => {
      const statusA = getInvestmentStatus(a);
      const statusB = getInvestmentStatus(b);
      return (statusA.daysRemaining || 0) - (statusB.daysRemaining || 0);
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BellRing className="text-indigo-600 dark:text-indigo-400" size={24} />
          Upcoming Reminders
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Investments maturing or due for premium in the next 30 days.</p>
      </div>

      {upcomingInvestments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
          <div className="bg-green-50 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">All clear!</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">No payments due or maturities in the next 30 days.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {upcomingInvestments.map(inv => (
            <InvestmentCard key={inv.id} data={inv} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Upcoming;