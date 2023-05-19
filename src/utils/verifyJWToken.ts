import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

interface ITokenData extends JwtPayload {
  userId: string;
}

const verifyJWToken = (token: string): Promise<ITokenData> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decodedData) => {
      if (err || !decodedData) {
        return reject(err);
      }

      resolve(decodedData as ITokenData);
    });
  });
};

export default verifyJWToken;
