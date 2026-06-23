
"use client";

import React, { createContext, useContext, useState } from 'react';

/**
 * Mock Authentication Hook
 * Provides a UI-only representation of a logged-in user without any Firebase dependency.
 */

interface AuthContextType {
  user: any | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock auth state for UI development
  const [user] = useState<any | null>({ 
    email: 'demo@nexus.ai', 
    role: 'admin', 
    userId: 'NX_ADMIN_01' 
  });
  const [loading] = useState(false);

  const logout = async () => {
    // In a real app, this would clear tokens. For UI demo, we keep the state static or refresh.
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
