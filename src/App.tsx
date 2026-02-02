import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Landing } from './components/Landing';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { PatientDashboard } from './components/Dashboard/PatientDashboard';
import { DoctorDashboard } from './components/Dashboard/DoctorDashboard';
import { MRODashboard } from './components/Dashboard/MRODashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';

type Page = 'landing' | 'login' | 'register' | 'dashboard';

function AppContent() {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    if (currentUser) {
      setCurrentPage('dashboard');
    } else if (currentPage === 'dashboard') {
      setCurrentPage('landing');
    }
  }, [currentUser, currentPage]);

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'mro':
        return <MRODashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  const renderPage = () => {
    if (currentUser) {
      return renderDashboard();
    }

    switch (currentPage) {
      case 'landing':
        return (
          <Landing 
            onLogin={() => setCurrentPage('login')} 
            onRegister={() => setCurrentPage('register')} 
          />
        );
      case 'login':
        return (
          <Login 
            onBack={() => setCurrentPage('landing')} 
            onRegister={() => setCurrentPage('register')}
            onSuccess={() => setCurrentPage('dashboard')}
          />
        );
      case 'register':
        return (
          <Register 
            onBack={() => setCurrentPage('landing')} 
            onLogin={() => setCurrentPage('login')}
          />
        );
      default:
        return (
          <Landing 
            onLogin={() => setCurrentPage('login')} 
            onRegister={() => setCurrentPage('register')} 
          />
        );
    }
  };

  return <>{renderPage()}</>;
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
