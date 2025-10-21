import { useState, useEffect } from 'react';
import PasswordLock from '@/components/PasswordLock';
import LoginForm from '@/components/LoginForm';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    // Check if user was previously logged in
    const savedUserId = sessionStorage.getItem('userId');
    const savedUserName = sessionStorage.getItem('userName');
    const savedUnlocked = sessionStorage.getItem('unlocked');
    
    if (savedUnlocked === 'true') {
      setIsUnlocked(true);
    }
    
    if (savedUserId && savedUserName) {
      setCurrentUserId(savedUserId);
      setCurrentUserName(savedUserName);
      setIsLoggedIn(true);
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('unlocked', 'true');
  };

  const handleLogin = (userId: string, userName: string) => {
    setCurrentUserId(userId);
    setCurrentUserName(userName);
    setIsLoggedIn(true);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('userName', userName);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserId('');
    setCurrentUserName('');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
  };

  if (!isUnlocked) {
    return <PasswordLock onUnlock={handleUnlock} />;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <ChatInterface
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      onLogout={handleLogout}
    />
  );
};

export default Index;
