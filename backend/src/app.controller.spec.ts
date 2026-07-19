import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import type { AuthenticatedRequest } from './common/types/authenticated-request';

jest.mock('./config/firebase.config', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
}));

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('profile', () => {
    it('should return current user payload', () => {
      const request = {
        user: {
          uid: 'firebase-uid',
          email: 'user@example.com',
        },
      } as AuthenticatedRequest;

      expect(appController.getProfile(request)).toEqual(request.user);
    });
  });
});
