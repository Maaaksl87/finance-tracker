import { Request as ExpressRequest } from "express";

export interface RequestWithRefreshUser extends ExpressRequest {
  user: {
    _id: string;
    email: string;
    name: string;
    refreshToken: string;
  };
}
