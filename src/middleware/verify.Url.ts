import { verify } from "jsonwebtoken";
import emailVerificationSecretModel from "../models/email.Secret.model";
import User from "../models/user.Model";
import RouteParamsHandler from "../types/RouteParams.type";

/**
 * @function verifyUrl - verify url when user try to update password
 * @description - Verify the url when try to update password
 * # find user id
 * # find email secret stored in database associated with user id
 * # verify token
 */

const verifyUrl: RouteParamsHandler = async (req, res, next) => {
  const { id, token } = req.params;

  try {
    const user = await User.findOne({ _id: id });

    // find user
    try {
      if (!user) return next(new Error("User not found"));

      if (!user.verified) return next(new Error("User is not verified"));

      // get secret email by user id
      const emailSecret = await emailVerificationSecretModel.findOne({
        userId: user?.id,
      });

      if (!emailSecret) return next(new Error("Email secret is not found"));

      const secret = emailSecret.secret;

      if (!secret) {
        throw new Error("Secret is not found");
      }

      // verify token
      const verifyToken = verify(token, secret);

      if (!verifyToken) return next(new Error("URL verification failed"));

      await emailVerificationSecretModel.deleteMany({ userId: id, secret });

      req.body.email = user.email;

      next();
    } catch (error) {
      console.log(error);
      return next(new Error(error.message));
    }
  } catch (error) {
    next(error.message);
  }
};

export default verifyUrl;
