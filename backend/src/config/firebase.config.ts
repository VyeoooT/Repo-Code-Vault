import {
  cert,
  initializeApp,
  getApps,
  type ServiceAccount,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as serviceAccount from './firebase-service-account.json';

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
}

export const adminAuth = getAuth();
