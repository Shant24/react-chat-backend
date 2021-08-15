import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { IUser } from '../types/User';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'User with the same Email already exists!'],
      required: [true, 'Email address is required!'],
      validate: [isEmail, 'Please fill a valid Email address!'],
    },
    fullName: {
      type: String,
      trim: true,
      min: [2, 'Full name must be at least 2 characters!'],
      required: [true, 'Full name is required!'],
    },
    avatar: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    confirmHash: {
      type: String,
      required: [true, 'Confirmation hash is required!'],
    },
    lastSeen: {
      type: String,
      default: new Date().toISOString(),
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
