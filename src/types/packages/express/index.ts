import express from 'express';

import { IUser } from '../../user';

export interface CustomRequest extends express.Request {
  user?: IUser;
}
