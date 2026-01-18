import { Investment } from '../types';

const STORAGE_KEY = 'dhanraksha_investments_v1';

export const getInvestments = (): Investment[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load investments', e);
    return [];
  }
};

export const saveInvestment = (investment: Investment): void => {
  const current = getInvestments();
  const updated = [investment, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateInvestment = (investment: Investment): void => {
  const current = getInvestments();
  const index = current.findIndex(item => item.id === investment.id);
  if (index !== -1) {
    current[index] = investment;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
};

export const deleteInvestment = (id: string): void => {
  const current = getInvestments();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};