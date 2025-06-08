'use client';

import { ReactNode, useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { subscribeToAuthChanges } = useAuthStore();

  useEffect(() => {
    subscribeToAuthChanges();
  }, [subscribeToAuthChanges]);

  return <>{children}</>;
}