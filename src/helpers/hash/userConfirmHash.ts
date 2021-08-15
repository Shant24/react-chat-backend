const generateUserConfirmationToken = (): string => {
  const chars: string = '0CK2ylP4YUoStOseVMif1r9FGJzRkvBEbQqp6c7NjHd8DZuLXng5xhWwA3maTI';
  let result: string = '';

  for (let i = 0; i < 30; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

export default generateUserConfirmationToken;
