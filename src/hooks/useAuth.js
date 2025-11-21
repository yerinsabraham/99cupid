import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * useAuth - Custom hook to use Auth context
 * Throws error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
