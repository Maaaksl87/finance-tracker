import { Request as ExpressRequest } from 'express';

import { UserWithoutPassword } from '../../auth/auth.service';

export interface RequestWithUser extends ExpressRequest {
  user: UserWithoutPassword;
}
