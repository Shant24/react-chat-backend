import { NextFunction, Response } from 'express';

import { CustomRequest } from '../types/packages/express';
import { UserModel } from '../models';

const updateLastSeen = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const _id = req.user?._id;

  try {
    await UserModel.updateOne({ _id }, { lastSeen: new Date().toISOString() });
  } catch (err) {
    console.log('err', err);
  } finally {
    next();
  }
};

export default updateLastSeen;