import { NextFunction, Response } from 'express';

import { CustomRequest } from '../types/packages/express';
import { UserModel } from '../models';

export default async (req: CustomRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  await UserModel.updateOne({ _id }, { lastSeen: new Date().toISOString() });

  next();
}
