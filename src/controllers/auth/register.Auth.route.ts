import Joi from "joi";
import RouteParamsHandler from "../../types/RouteParams.type";
import User from "../../models/user.Model";
import CustomErrorHandler from "../../utils/CustomError.Handler";
import {
  generateEmailVerificationToken,
  sendVerificationMail,
} from "../../utils/email.Helper";

/**
 * @function registerUser - Register new users
 * ## Steps
 * # Validate User entered Credentials with Joi
 * # Check User email in database
 * # Save User Credentials in database
 * # Send email verification link
 */

const registerUser: RouteParamsHandler = async (req, res, next) => {
  try {
    // user register credentials validation
    const registerValidationSchema = Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
      repeatPassword: Joi.ref("password"),
    });

    const { error } = registerValidationSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // check email exists in database
    try {
      const { email } = req.body;
      const CheckUserExist = await User.exists({ email });
      if (CheckUserExist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is not available")
        );
      }
    } catch (error) {
      return next(error);
    }

    // save user credentials in database
    try {
      const { username, email, password } = req.body;
      const newUser = new User({
        username,
        email,
        password,
      });
      const user = await newUser.save();

      // Verify user email
      const userId = user.id;
      const verificationToken = await generateEmailVerificationToken(
        userId,
        email
      );

      const verificationUrl = `http://localhost:3000/verify-email/${userId}/${verificationToken}`;
      // console.log(verificationUrl);

      await sendVerificationMail(email, verificationUrl);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
    res.status(201).json({
      message: "User Registered Successfully.Please Verify Your email",
    });
  } catch (error) {
    return next(error);
  }
};

export default registerUser;
