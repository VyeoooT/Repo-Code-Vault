import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { auth } from '../lib/firebase';
import { AuthContext, type AuthContextValue } from './auth-context';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setIdToken(nextUser ? await nextUser.getIdToken() : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      idToken,
      loading,
      signOut: async () => {
        await firebaseSignOut(auth);
      },
    }),
    [idToken, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
