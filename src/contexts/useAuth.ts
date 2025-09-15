import { useContext } from 'react';
import { AuthContext } from './AuthContext.context';
import type { AuthContextValue } from './AuthContext.types';

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
