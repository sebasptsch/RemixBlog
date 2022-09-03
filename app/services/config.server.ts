export const config = {
  getOrThrow: (key: string) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing value: ${key}`);
    return value;
  },
  get: (key: string) => process.env[key],
};
