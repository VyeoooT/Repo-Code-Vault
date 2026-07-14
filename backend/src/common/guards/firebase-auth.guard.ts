import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { adminAuth } from '../../config/firebase.config'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token')
    }

    const token = authHeader.split('Bearer ')[1]

    try {
      const decodedToken = await adminAuth.verifyIdToken(token)
      request.user = decodedToken
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
