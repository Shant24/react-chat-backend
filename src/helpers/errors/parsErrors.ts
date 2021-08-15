export const parseCreatingUserErrors = (e: any | undefined) => {
  return {
    error: e.errors || {
      email: {
        name: 'ValidatorError',
        message: 'User with the same Email already exists!',
        properties: {
          message: 'User with the same Email already exists!',
          type: 'unique',
          path: 'email',
        },
        type: 'unique',
        path: 'email',
      },
    },
  };
};
