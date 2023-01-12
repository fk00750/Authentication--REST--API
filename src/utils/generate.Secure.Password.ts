import Pepper from "../models/pepper.Model";
import { randomFillSync } from "crypto";
import { genSalt, hash } from "bcrypt";

/**
 * @function generatePassword - it create a saltedPassword (user password + random pepper value) and hash that salted password.
 * @param userId - Id of User
 * @param password - user normal password before hashed 
 * @returns {string} - hashed password value
 */

const generatePassword = async function (
  userId: string,
  password: string
): Promise<string> {
  try {
    // create a random pepper value for every user
    const pepperBuffer = Buffer.alloc(32);
    randomFillSync(pepperBuffer);
    const pepperValue = pepperBuffer.toString("hex");

    // save the pepper value into DB with user id 
    await new Pepper({ userId, pepperValue }).save();

    // user normal password + pepper value
    const saltedPassword = password + pepperValue;

    // Hashing the Password after it pepper and password is combined
    const salt = await genSalt(12);
    const HashedPassword = await hash(saltedPassword, salt);

    return HashedPassword;
  } catch (error) {
    throw error;
  }
};

export default generatePassword;
