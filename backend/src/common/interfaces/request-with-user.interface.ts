import { Request as ExpressRequest } from 'express';
import { UserWithoutPassword } from '../../auth/auth.service';
import { Types } from 'mongoose';

export interface RequestWithUser extends ExpressRequest {
  user: UserWithoutPassword & { _id: Types.ObjectId }; //todo: переглянути типізацію створення користувача
}
