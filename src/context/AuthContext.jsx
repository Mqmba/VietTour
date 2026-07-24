import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      // Unwrap if it was saved with nested structure
      const actualUser = parsed?.user || parsed?.data || parsed;
      return actualUser && typeof actualUser === 'object' && (actualUser.id || actualUser.email || actualUser.full_name) ? actualUser : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // Sync / Verify profile with backend on app load if token exists
  useEffect(() => {
    if (token) {
      authAPI.getMe()
        .then((resData) => {
          const userData = resData?.user || resData?.data || resData;
          if (userData && (userData.id || userData.email || userData.full_name)) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        })
        .catch((err) => {
          console.error('Failed to verify token / fetch user profile:', err);
          if (err.message && (err.message.includes('401') || err.message.includes('token') || err.message.includes('xác thực'))) {
            logout();
          }
        });
    }
  }, [token]);

  const login = (userData, tokenData) => {
    const actualUser = userData?.user || userData?.data || userData;
    setUser(actualUser);
    setToken(tokenData);
    if (tokenData) localStorage.setItem('token', tokenData);
    if (actualUser) localStorage.setItem('user', JSON.stringify(actualUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
