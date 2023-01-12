import { compare } from "bcrypt";
import Pepper from "../models/pepper.Model";


/**
 * @function CheckPasswordValidity - Check the password validity
 * @param {any} userId - Id of User
 * @param {string} currentPassword - password which user entered while login
 * @param {string} hashedPassword - password stored in database as hashed value
 * @returns {boolean} - Returns true if password is correct 
 */

const CheckPasswordValidity = async (
  userId: any,
  currentPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    // check pepper value of the user with user id
    const UserPepper = await Pepper.findOne({ userId });


    if (!UserPepper) {
      throw new Error("Pepper value is not valid");
    }

    // complete password
    const CompletePassword = currentPassword + UserPepper.pepperValue;

    // Comparing the password
    const PasswordMatched = await compare(CompletePassword, hashedPassword);

    return PasswordMatched;
  } catch (error) {
    throw error;
  }
};

export default CheckPasswordValidity;
