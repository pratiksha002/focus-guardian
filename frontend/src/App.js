import React, { useState, useContext } from 'react';
import { Eye, BarChart3, Sliders, History, UserCircle, TrendingUp, Calendar, Users } from 'lucide-react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GamificationProvider } from './context/GamificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/Login';
import { RegisterPage } from './components/pages/Register';
import { FocusModePage } from './components/pages/FocusMode';
import { DashboardPage } from './components/pages/Dashboard';
import { SessionsPage } from './components/pages/SessionsPage';
import { SettingsPage } from './components/pages/Settings';
import { AccountPage } from './components/pages/AccountPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { CalendarView } from './components/pages/CalendarView';
import { SocialPage } from './components/pages/SocialPage';

const FocusGuardianApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [authPage, setAuthPage] = useState('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, loading } = useContext(AuthContext);
  
  const pages = [
    { id: 'focus', label: 'Focus Mode', icon: Eye, component: FocusModePage },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: DashboardPage },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, component: AnalyticsPage },
    { id: 'calendar', label: 'Calendar', icon: Calendar, component: CalendarView },
    { id: 'sessions', label: 'Sessions', icon: History, component: SessionsPage },
    { id: 'social', label: 'Social', icon: Users, component: SocialPage },
    { id: 'account', label: 'Account', icon: UserCircle, component: AccountPage },
    { id: 'settings', label: 'Settings', icon: Sliders, component: SettingsPage }
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    if (currentPage === 'landing') {
      return <LandingPage onStart={() => setCurrentPage('auth')} />;
    }
    
    if (authPage === 'login') {
      return <LoginPage onSwitchToRegister={() => setAuthPage('register')} />;
    }
    
    return <RegisterPage onSwitchToLogin={() => setAuthPage('login')} />;
  }
  
  const CurrentPageComponent = pages.find(p => p.id === currentPage)?.component || FocusModePage;
  
  return (
    <Layout 
      pages={pages} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <CurrentPageComponent />
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GamificationProvider>
          <SettingsProvider>
            <FocusGuardianApp />
          </SettingsProvider>
        </GamificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}