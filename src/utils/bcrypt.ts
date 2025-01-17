import * as bcrypt from "bcrypt";

export const hashPassWord = async (plainPassword: string) => {
  const saltRounds = 10;

  try {
    return await bcrypt?.hash(plainPassword, saltRounds);
  } catch (error) {
    throw new Error(error);
  }
};

export const compatePassword = async (plainPassword: string, hash: string) => {
  try {
    return await bcrypt.compare(plainPassword, hash);
  } catch (error) {
    throw new Error(error);
  }
};
