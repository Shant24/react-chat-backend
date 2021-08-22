import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

interface ITokenData {
  userId: string;
}

export default (token: string): Promise<ITokenData> => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_SECRET, (err, decodedData) => {
    if (err || !decodedData) {
      return reject(err);
    }

    resolve(decodedData as ITokenData);
  });
})
