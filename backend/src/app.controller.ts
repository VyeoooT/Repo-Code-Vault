import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard';
import type { AuthenticatedRequest } from './common/types/authenticated-request';

@Controller()
export class AppController {
  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  getProfile(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
