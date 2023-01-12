import { genSalt, hash } from "bcrypt";

const generatePassword = async (password: string): Promise<string> => {
  try {
    const salt = await genSalt(12);
    const generateHash = await hash(password, salt);

    return new Promise((resolve) => {
      resolve(generateHash);
    });
  } catch (error) {
    throw error;
  }
};

