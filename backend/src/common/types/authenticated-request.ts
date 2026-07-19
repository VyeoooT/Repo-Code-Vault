import type { DecodedIdToken } from 'firebase-admin/auth';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: DecodedIdToken;
}
