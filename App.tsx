import React, { useState, useEffect } from 'react';
import { User, ViewState } from './types';
import { AuthForm } from './components/AuthForm';
import { FamilyTreeViz } from './components/FamilyTreeViz';
import { Messaging } from './components/Messaging';
import { Announcements } from './components/Announcements';
import { Layout } from './components/Layout';
import { checkSession } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('tree');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session token
    const initSession = async () => {
      try {
        const sessionUser = await checkSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (e) {
        // No session
      } finally {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('tree');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('tree'); // Reset view on logout
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
    >
      {currentView === 'tree' && <FamilyTreeViz />}
      {currentView === 'messaging' && <Messaging currentUser={user} />}
      {currentView === 'gallery' && <Announcements />} 
    </Layout>
  );
};

export default App;