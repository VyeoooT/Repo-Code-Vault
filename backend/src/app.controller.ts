import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard'

@Controller()
export class AppController {
  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  getProfile(@Request() req) {
    return req.user
  }
}
