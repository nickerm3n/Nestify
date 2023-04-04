export const mockUsers = Array(10)
  .fill(0)
  .map((_, i) => ({
    login: `user${i + 1}`,
    password: `password${i + 1}`,
    age: 4 + i,
    isDeleted: false,
  }));
