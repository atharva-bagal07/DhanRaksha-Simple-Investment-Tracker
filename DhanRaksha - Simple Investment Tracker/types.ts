export enum InvestmentType {
  FD = 'Fixed Deposit (FD/RD)',
  SIP = 'SIP / Mutual Fund',
  INSURANCE = 'Insurance / LIC',
  PPF = 'PPF / EPF'
}

export interface BaseInvestment {
  id: string;
  name: string;
  type: InvestmentType;
  createdAt: number;
}

export interface FDInvestment extends BaseInvestment {
  type: InvestmentType.FD;
  amount: number;
  startDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
}

export interface SIPInvestment extends BaseInvestment {
  type: InvestmentType.SIP;
  monthlyAmount: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD (optional, empty means ongoing)
}

export interface InsuranceInvestment extends BaseInvestment {
  type: InvestmentType.INSURANCE;
  policyNumber: string;
  premiumAmount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
  nextPremiumDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
}

export interface PPFInvestment extends BaseInvestment {
  type: InvestmentType.PPF;
  startYear: number;
  yearlyContribution: number;
  maturityYear: number;
}

export type Investment = FDInvestment | SIPInvestment | InsuranceInvestment | PPFInvestment;

export interface ReminderStatus {
  message: string;
  daysRemaining: number | null; // null if ongoing or irrelevant
  isUrgent: boolean; // < 30 days
  type: 'maturity' | 'premium' | 'ongoing' | 'expired';
}