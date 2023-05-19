import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'terces';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

const createJWToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
    algorithm: 'HS256',
  });
};

export default createJWToken;
