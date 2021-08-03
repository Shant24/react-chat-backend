export interface IUser {
  _id: string;
  email: string;
  avatar: string;
  fullName: string;
  password: string; // (md5)
  confirmed: boolean;
  confirmHash: string;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}
