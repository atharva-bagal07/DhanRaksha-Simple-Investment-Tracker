import React, { useState, useRef, useEffect } from 'react';
import { Investment, InvestmentType } from '../types';
import { getInvestmentStatus, formatCurrency, formatDate } from '../utils/dateUtils';
import { Trash2, TrendingUp, Shield, Landmark, PiggyBank, Clock, AlertCircle, Edit2, MoreVertical } from 'lucide-react';

interface Props {
  data: Investment;
  onDelete: (id: string) => void;
  onEdit: (investment: Investment) => void;
}

const InvestmentCard: React.FC<Props> = ({ data, onDelete, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const status = getInvestmentStatus(data);

  const getIcon = () => {
    switch (data.type) {
      case InvestmentType.FD: return <Landmark className="text-indigo-600 dark:text-indigo-400" size={20} />;
      case InvestmentType.SIP: return <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />;
      case InvestmentType.INSURANCE: return <Shield className="text-purple-600 dark:text-purple-400" size={20} />;
      case InvestmentType.PPF: return <PiggyBank className="text-orange-600 dark:text-orange-400" size={20} />;
    }
  };

  const getStatusBadge = () => {
    let baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ";
    if (status.type === 'expired') return baseClass + 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    if (status.isUrgent) return baseClass + 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
    if (status.type === 'ongoing') return baseClass + 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
    return baseClass + 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
  };

  const DetailRow = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{value}</span>
      {sub && <span className="text-xs text-slate-500 dark:text-slate-400">{sub}</span>}
    </div>
  );

  const renderDetails = () => {
    if (data.type === InvestmentType.FD) {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <DetailRow label="Principal" value={formatCurrency(data.amount)} />
          <DetailRow label="Maturity Date" value={formatDate(data.maturityDate)} />
        </div>
      );
    }
    if (data.type === InvestmentType.SIP) {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
           <DetailRow label="Monthly" value={formatCurrency(data.monthlyAmount)} />
           <DetailRow label="End Date" value={data.endDate ? formatDate(data.endDate) : 'Ongoing'} />
        </div>
      );
    }
    if (data.type === InvestmentType.INSURANCE) {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <DetailRow label="Premium" value={formatCurrency(data.premiumAmount)} sub={data.frequency} />
          <DetailRow label="Next Due" value={formatDate(data.nextPremiumDate)} />
        </div>
      );
    }
    if (data.type === InvestmentType.PPF) {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
           <DetailRow label="Yearly Contribution" value={formatCurrency(data.yearlyContribution)} />
           <DetailRow label="Maturity Year" value={data.maturityYear.toString()} />
        </div>
      );
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all duration-200 relative">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white leading-tight">{data.name}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{data.type}</span>
          </div>
        </div>
        
        {/* Three Dot Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            title="Options"
          >
            <MoreVertical size={20} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden animate-fadeIn">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit(data); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <Edit2 size={16} className="text-slate-400" /> Edit
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete(data.id); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors border-t border-slate-100 dark:border-slate-700"
              >
                <Trash2 size={16} className="text-red-500/70" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {renderDetails()}

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-3">
        <div className={getStatusBadge()}>
          {status.isUrgent && <AlertCircle size={12} className="mr-1" />}
          {status.message}
        </div>
        {!status.isUrgent && data.type !== InvestmentType.SIP && (
            <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock size={12} />
                <span>Tracked</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentCard;