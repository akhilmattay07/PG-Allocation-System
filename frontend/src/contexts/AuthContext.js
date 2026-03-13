import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('pgAllocatorUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('pgAllocatorUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('pgAllocatorUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pgAllocatorUser');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isOwner = () => {
    return user && user.role === 'owner';
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isTenant = () => {
    return user && user.role === 'tenant';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isOwner,
    isAdmin,
    isTenant,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
