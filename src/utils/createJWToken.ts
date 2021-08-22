import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'terces';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

export default (userId: string): string => jwt.sign(
  { userId },
  JWT_SECRET,
  {
    expiresIn: JWT_EXPIRES,
    algorithm: 'HS256',
  },
);
