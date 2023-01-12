// Forgot password
// verify user entered email
// send link to user email

import Joi from "joi";
import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import CustomErrorHandler from "../../utils/CustomError.Handler";
import { generateEmailVerificationToken } from "../../utils/email.Helper";

const forgotPassword: RouteParamsHandler = async (req, res, next) => {
  try {
    const EmailValidationSchema = Joi.object({
      email: Joi.string().email(),
    });

    const { error } = EmailValidationSchema.validate(req.body);

    if (error) return next(CustomErrorHandler.serverError(error.message));

    const { email } = req.body;

    try {
      // find email in database
      const user = await User.findOne({ email });

      if (!user) return next(new Error("User not found"));

      if (!user.verified)
        return next(CustomErrorHandler.unAuthorized("User is not verified"));

      const verificationToken = await generateEmailVerificationToken(
        user.id,
        email
      );

      const verificationUrl = `http://localhost:3000/update-password/${user.id}/${verificationToken}`;
      console.log(verificationUrl);
      
      res.send("Reset Password link sent to email");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

export default forgotPassword;
