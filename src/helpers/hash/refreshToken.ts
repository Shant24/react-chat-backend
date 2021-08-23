const generateRefreshToken = (count: number = 30): string => {
  const chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result: string = '';

  for (let i = 0; i < count; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

export default generateRefreshToken;
