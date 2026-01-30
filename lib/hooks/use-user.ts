import {getUser, isUserAuthenticated} from '../auth';
import type {User} from '../api/services/auth.service';
import {useEffect, useState} from 'react';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setIsAuthenticated(isUserAuthenticated());
  }, []);

  return {user, isAuthenticated};
};
