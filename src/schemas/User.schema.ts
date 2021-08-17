import { Schema } from 'mongoose';

import isEmail from 'validator/lib/isEmail';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'User with the same Email already exists!'],
      validate: [isEmail, 'Please fill a valid Email address!'],
      required: [true, 'Email address is required!'],
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
      required: false,
    },

    password: {
      type: String,
      required: [true, 'Password is required!'],
    },

    confirmed: {
      type: Boolean,
      default: false,
      required: false,
    },

    confirmHash: {
      type: String,
      required: [true, 'Confirmation hash is required!'],
    },

    lastSeen: {
      type: String,
      default: new Date().toISOString(),
      required: false,
    },
  },
  { timestamps: true },
);

export default UserSchema;
