import { NextFunction, Response } from 'express';

import { CustomRequest } from '../types/packages/express';
import { IUser } from '../types/user';
import { verifyJWToken } from '../utils';
import { UserModel } from '../models';

const checkAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('Not authorized to access this resource!');
    }

    const token = req.headers.authorization.replace('Bearer ', '');
    const jwtData = await verifyJWToken(token);

    if (!jwtData) {
      throw new Error('Invalid auth token provided!');
    }

    const user: IUser | null = await UserModel.findOne({ _id: jwtData.userId, 'tokens.jwt': token });

    if (!user) {
      throw new Error('Invalid auth token provided!');
    }

    req.user = user;

    next();
  } catch (error) {
    // @ts-ignore
    res.status(401).send({ error: { message: error.message } });
  }
};

export default checkAuth;
