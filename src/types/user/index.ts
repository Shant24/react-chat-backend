import { Document } from 'mongoose';

export interface IUser extends Document<string> {
  email: string;
  fullName: string;
  avatar: string;
  password: string;
  confirmed: boolean;
  confirmHash: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  tokens?: {
    jwt: string;
    refreshToken: string;
  };
}
