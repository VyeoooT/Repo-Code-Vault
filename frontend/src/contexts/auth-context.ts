import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface AuthContextValue {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
