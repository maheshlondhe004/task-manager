import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { UserContextType } from '../contexts/UserContext';

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
