import mongoose from 'mongoose';

import { IUser } from '../types/user';
import { UserSchema } from '../schemas';

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
