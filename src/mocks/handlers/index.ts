import { authHandler } from './auth-handler';
import { userHandler } from './user-handler';

export const handlers = [...authHandler, ...userHandler];
