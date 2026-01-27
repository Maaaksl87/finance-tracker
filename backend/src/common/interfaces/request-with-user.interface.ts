import { Request as ExpressRequest } from 'express';

export interface RequestWithUser extends ExpressRequest {
  user: {
    _id: string;
    email: string;
    name?: string;
  };
}
