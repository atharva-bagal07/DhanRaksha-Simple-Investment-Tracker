import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Upcoming from './components/Upcoming';
import AddInvestmentForm from './components/AddInvestmentForm';
import { getInvestments, saveInvestment, updateInvestment, deleteInvestment } from './services/storageService';
import { Investment } from './types';
import { getInvestmentStatus } from './utils/dateUtils';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'add' | 'upcoming'>('dashboard');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null); // State for delete modal
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Load data
    const data = getInvestments();
    setInvestments(data);
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSave = (inv: Investment) => {
    const exists = investments.some(i => i.id === inv.id);
    if (exists) {
      updateInvestment(inv);
    } else {
      saveInvestment(inv);
    }
    setInvestments(getInvestments());
    setEditingInvestment(null);
    setView('dashboard');
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteInvestment(deleteId);
      setInvestments(getInvestments());
      setDeleteId(null);
    }
  };

  const handleEdit = (inv: Investment) => {
    setEditingInvestment(inv);
    setView('add');
  };

  const handleNavigate = (newView: 'dashboard' | 'add' | 'upcoming') => {
    if (newView !== 'add') {
      setEditingInvestment(null);
    }
    setView(newView);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard investments={investments} onAdd={() => handleNavigate('add')} onDelete={requestDelete} onEdit={handleEdit} />;
      case 'upcoming':
        return <Upcoming investments={investments} onDelete={requestDelete} onEdit={handleEdit} />;
      case 'add':
        return (
          <AddInvestmentForm 
            key={editingInvestment ? editingInvestment.id : 'new'} 
            onBack={() => handleNavigate('dashboard')} 
            onSave={handleSave} 
            initialData={editingInvestment} 
          />
        );
      default:
        return <Dashboard investments={investments} onAdd={() => handleNavigate('add')} onDelete={requestDelete} onEdit={handleEdit} />;
    }
  };

  return (
    <Layout currentView={view} onNavigate={handleNavigate} theme={theme} toggleTheme={toggleTheme}>
      {renderContent()}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Delete {investments.find(i => i.id === deleteId)?.name || 'Investment'}?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to remove this investment? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;