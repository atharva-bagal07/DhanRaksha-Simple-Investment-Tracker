import React, { useState } from 'react';
import { InvestmentType, Investment } from '../types';
import { Save, X, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSave: (investment: Investment) => void;
  initialData?: Investment | null;
}

// Reusable Date Input Component with Calendar Icon
const DateInput = ({ 
  label, 
  value, 
  onChange, 
  required = false, 
  subText 
}: { 
  label: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  required?: boolean; 
  subText?: string;
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative group">
        <input
          type="date"
          required={required}
          value={value}
          onChange={onChange}
          // The CSS here expands the click area of the calendar icon to the full input
          // appearance-none removes default browser styling
          // pointer-events-auto ensures the input captures clicks
          className="w-full p-2.5 pr-10 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800 cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          onClick={(e) => {
              // Explicitly try to open picker on click as backup for non-webkit
              try {
                  if (typeof (e.target as HTMLInputElement).showPicker === 'function') {
                      (e.target as HTMLInputElement).showPicker();
                  }
              } catch(e) {}
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 px-3 text-slate-400 flex items-center justify-center pointer-events-none"
        >
          <CalendarIcon size={18} />
        </div>
      </div>
      {subText && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subText}</p>}
    </div>
  );
};

const AddInvestmentForm: React.FC<Props> = ({ onBack, onSave, initialData }) => {
  const getField = (field: keyof any, expectedType?: InvestmentType) => {
    if (!initialData) return '';
    if (expectedType && initialData.type !== expectedType) return '';
    return (initialData as any)[field] !== undefined ? (initialData as any)[field] : '';
  };

  const [type, setType] = useState<InvestmentType>(initialData?.type || InvestmentType.FD);
  const [name, setName] = useState(initialData?.name || '');
  
  // FD State
  const [amount, setAmount] = useState(getField('amount', InvestmentType.FD));
  const [startDate, setStartDate] = useState(getField('startDate', InvestmentType.FD));
  const [maturityDate, setMaturityDate] = useState(getField('maturityDate', InvestmentType.FD));

  // SIP State
  const [monthlyAmount, setMonthlyAmount] = useState(getField('monthlyAmount', InvestmentType.SIP));
  const [sipStartDate, setSipStartDate] = useState(getField('startDate', InvestmentType.SIP));
  const [sipEndDate, setSipEndDate] = useState(getField('endDate', InvestmentType.SIP));

  // Insurance State
  const [policyNumber, setPolicyNumber] = useState(getField('policyNumber', InvestmentType.INSURANCE));
  const [premiumAmount, setPremiumAmount] = useState(getField('premiumAmount', InvestmentType.INSURANCE));
  const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly' | 'Yearly'>(getField('frequency', InvestmentType.INSURANCE) || 'Yearly');
  const [nextPremiumDate, setNextPremiumDate] = useState(getField('nextPremiumDate', InvestmentType.INSURANCE));
  const [insMaturityDate, setInsMaturityDate] = useState(getField('maturityDate', InvestmentType.INSURANCE));

  // PPF State
  const [ppfStartYear, setPpfStartYear] = useState(getField('startYear', InvestmentType.PPF));
  const [ppfYearlyContrib, setPpfYearlyContrib] = useState(getField('yearlyContribution', InvestmentType.PPF));
  const [ppfMaturityYear, setPpfMaturityYear] = useState(getField('maturityYear', InvestmentType.PPF));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = initialData?.id || Date.now().toString();
    const createdAt = initialData?.createdAt || Date.now();

    let newInvestment: Investment;

    if (type === InvestmentType.FD) {
      newInvestment = { id, type, name, createdAt, amount: parseFloat(amount), startDate, maturityDate };
    } else if (type === InvestmentType.SIP) {
      newInvestment = { id, type, name, createdAt, monthlyAmount: parseFloat(monthlyAmount), startDate: sipStartDate, endDate: sipEndDate || undefined };
    } else if (type === InvestmentType.INSURANCE) {
      newInvestment = { id, type, name, createdAt, policyNumber, premiumAmount: parseFloat(premiumAmount), frequency, nextPremiumDate, maturityDate: insMaturityDate };
    } else {
      newInvestment = { id, type, name, createdAt, startYear: parseInt(ppfStartYear), yearlyContribution: parseFloat(ppfYearlyContrib), maturityYear: parseInt(ppfMaturityYear) };
    }

    onSave(newInvestment);
  };

  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
  const isEditing = !!initialData;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
      <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Investment' : 'Add New Investment'}</h2>
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Type Selector */}
        {!isEditing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <label className={labelClass}>Select Investment Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as InvestmentType)}
              className={`${inputClass} font-medium`}
            >
              {Object.values(InvestmentType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
        
        {isEditing && (
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
            Editing <strong>{type}</strong>
          </div>
        )}

        {/* Common Name Field */}
        <div>
          <label className={labelClass}>
            {type === InvestmentType.SIP ? 'Fund Name' : 
             type === InvestmentType.INSURANCE ? 'Policy Name' : 
             'Bank / Investment Name'}
          </label>
          <input 
            required
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className={inputClass}
            placeholder={type === InvestmentType.FD ? "e.g. HDFC FD" : "e.g. LIC Policy"}
          />
        </div>

        {/* Dynamic Fields */}
        {type === InvestmentType.FD && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className={labelClass}>Principal Amount (₹)</label>
              <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inputClass} placeholder="100000" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateInput 
                label="Start Date" 
                required 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
              <DateInput 
                label="Maturity Date" 
                required 
                value={maturityDate} 
                onChange={e => setMaturityDate(e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === InvestmentType.SIP && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className={labelClass}>Monthly SIP Amount (₹)</label>
              <input required type="number" value={monthlyAmount} onChange={e => setMonthlyAmount(e.target.value)} className={inputClass} placeholder="5000" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateInput 
                label="Start Date" 
                required 
                value={sipStartDate} 
                onChange={e => setSipStartDate(e.target.value)} 
              />
              <DateInput 
                label="End Date (Optional)" 
                value={sipEndDate} 
                onChange={e => setSipEndDate(e.target.value)} 
                subText="Leave blank if ongoing"
              />
            </div>
          </div>
        )}

        {type === InvestmentType.INSURANCE && (
          <div className="space-y-4 animate-fadeIn">
             <div>
              <label className={labelClass}>Policy Last 4 Digits</label>
              <input required type="text" maxLength={4} value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} className={inputClass} placeholder="XXXX" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Premium Amount (₹)</label>
                    <input required type="number" value={premiumAmount} onChange={e => setPremiumAmount(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Frequency</label>
                    <select value={frequency} onChange={e => setFrequency(e.target.value as any)} className={inputClass}>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateInput 
                label="Next Premium Due" 
                required 
                value={nextPremiumDate} 
                onChange={e => setNextPremiumDate(e.target.value)} 
              />
              <DateInput 
                label="Policy Maturity Date" 
                required 
                value={insMaturityDate} 
                onChange={e => setInsMaturityDate(e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === InvestmentType.PPF && (
          <div className="space-y-4 animate-fadeIn">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Start Year</label>
                    <input required type="number" placeholder="2020" value={ppfStartYear} onChange={e => setPpfStartYear(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Maturity Year</label>
                    <input required type="number" placeholder="2035" value={ppfMaturityYear} onChange={e => setPpfMaturityYear(e.target.value)} className={inputClass} />
                </div>
            </div>
            <div>
              <label className={labelClass}>Estimated Yearly Contribution (₹)</label>
              <input required type="number" value={ppfYearlyContrib} onChange={e => setPpfYearlyContrib(e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        <div className="pt-4 flex gap-3">
            <button 
            type="button"
            onClick={onBack}
            className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-3 rounded-lg font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
            Cancel
            </button>
            <button 
            type="submit" 
            className="flex-[2] bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
            <Save size={18} />
            {isEditing ? 'Update Investment' : 'Save Investment'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvestmentForm;