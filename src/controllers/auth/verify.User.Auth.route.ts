import { verify } from "jsonwebtoken";
import emailVerificationSecretModel from "../../models/email.Secret.model";
import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";
import CustomErrorHandler from "../../utils/CustomError.Handler";

const verifyUserEmail: RouteParamsHandler = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    try {
      const user = await User.findOne({ _id: id });
      const emailSecret = await emailVerificationSecretModel.findOne({
        userId: user?._id,
      });

      if (user?.verified)
        return next(
          CustomErrorHandler.unAuthorized("Email is already verified")
        );

      if (user && emailSecret) {
        const secret = emailSecret.secret;
        const verifyEmail = verify(token, String(secret));

        if (!verifyEmail) throw new Error("User Email Verification Failed");

        user.verified = true;
        await user.save();

        await emailVerificationSecretModel.deleteMany({ userId: id, secret });
      }
    } catch (error) {
      throw error;
    }
    res.send("Email Verification Successful");
  } catch (error) {
    return next(new Error("User Verification Failed"));
  }
};

export default verifyUserEmail;
