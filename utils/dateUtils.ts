import { Investment, InvestmentType, ReminderStatus } from '../types';

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getDaysDifference = (targetDateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getInvestmentStatus = (investment: Investment): ReminderStatus => {
  if (investment.type === InvestmentType.FD) {
    const days = getDaysDifference(investment.maturityDate);
    if (days < 0) return { message: 'Matured', daysRemaining: days, isUrgent: false, type: 'expired' };
    if (days === 0) return { message: 'Matures Today', daysRemaining: 0, isUrgent: true, type: 'maturity' };
    return {
      message: `Matures in ${days} days`,
      daysRemaining: days,
      isUrgent: days <= 30,
      type: 'maturity'
    };
  }

  if (investment.type === InvestmentType.INSURANCE) {
    const maturityDays = getDaysDifference(investment.maturityDate);
    const premiumDays = getDaysDifference(investment.nextPremiumDate);

    // Prioritize maturity if it's closer and in the future
    if (maturityDays >= 0 && maturityDays < premiumDays) {
       return {
        message: `Matures in ${maturityDays} days`,
        daysRemaining: maturityDays,
        isUrgent: maturityDays <= 30,
        type: 'maturity'
      };
    }

    if (premiumDays < 0) return { message: 'Premium Overdue', daysRemaining: premiumDays, isUrgent: true, type: 'premium' };
    if (premiumDays === 0) return { message: 'Premium Due Today', daysRemaining: 0, isUrgent: true, type: 'premium' };
    
    return {
      message: `Premium due in ${premiumDays} days`,
      daysRemaining: premiumDays,
      isUrgent: premiumDays <= 30,
      type: 'premium'
    };
  }

  if (investment.type === InvestmentType.SIP) {
    if (!investment.endDate) {
      return { message: 'Ongoing SIP', daysRemaining: null, isUrgent: false, type: 'ongoing' };
    }
    const days = getDaysDifference(investment.endDate);
    if (days < 0) return { message: 'SIP Ended', daysRemaining: days, isUrgent: false, type: 'expired' };
    return {
      message: `Ends in ${days} days`,
      daysRemaining: days,
      isUrgent: days <= 30,
      type: 'maturity'
    };
  }

  if (investment.type === InvestmentType.PPF) {
    const currentYear = new Date().getFullYear();
    const yearsLeft = investment.maturityYear - currentYear;
    
    if (yearsLeft < 0) return { message: 'Matured', daysRemaining: 0, isUrgent: false, type: 'expired' };
    if (yearsLeft === 0) return { message: 'Matures this year', daysRemaining: 1, isUrgent: true, type: 'maturity' };
    
    return {
      message: `Matures in ${yearsLeft} years`,
      daysRemaining: yearsLeft * 365,
      isUrgent: false,
      type: 'maturity'
    };
  }

  return { message: 'Unknown', daysRemaining: null, isUrgent: false, type: 'ongoing' };
};