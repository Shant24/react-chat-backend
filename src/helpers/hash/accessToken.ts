const generateAccessToken = (userId: Required<string>): string => {
  const chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_+=()!@#$%^&*';

  let result: string = `${userId}:`;

  for (let i = 0; i < 40; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

export default generateAccessToken;
