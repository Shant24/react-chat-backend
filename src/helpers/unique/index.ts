export const getUniqueIdFromIds = (ids: Required<string[]>): string => {
  return ids.join('')
    .split('')
    .sort((a: string, b: string) => a.localeCompare(b))
    .join('');
};
