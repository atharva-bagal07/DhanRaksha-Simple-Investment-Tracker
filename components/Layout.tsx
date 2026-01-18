import React from 'react';
import { Wallet, LayoutDashboard, Bell, Moon, Sun } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  currentView: 'dashboard' | 'add' | 'upcoming';
  onNavigate: (view: 'dashboard' | 'add' | 'upcoming') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<Props> = ({ children, currentView, onNavigate, theme, toggleTheme }) => {
  const navLinkClass = (view: 'dashboard' | 'add' | 'upcoming') => 
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">DhanRaksha</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex space-x-2 items-center mr-4">
                <button onClick={() => onNavigate('dashboard')} className={navLinkClass('dashboard')}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
                <button onClick={() => onNavigate('upcoming')} className={navLinkClass('upcoming')}>
                  <Bell size={18} />
                  Upcoming
                </button>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Tab Bar */}
        <div className="sm:hidden flex border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
           <button onClick={() => onNavigate('dashboard')} className={`flex-1 py-3 text-xs font-medium text-center ${currentView === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Dashboard</button>
           <button onClick={() => onNavigate('upcoming')} className={`flex-1 py-3 text-xs font-medium text-center ${currentView === 'upcoming' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Upcoming</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               <span className="text-slate-900 dark:text-white font-bold">DhanRaksha</span>
               <span className="text-slate-300 dark:text-slate-600">|</span>
               <span className="text-slate-500 dark:text-slate-400 text-sm">Simple Investment Tracker</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              This app is for tracking purposes only. Not a trading platform. Data is stored locally.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;