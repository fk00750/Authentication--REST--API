import RouteParamsHandler from "../../types/RouteParams.type";
import Joi from "joi";
import CustomErrorHandler from "../../utils/CustomError.Handler";
import User from "../../models/user.Model";
import CheckPasswordValidity from "../../utils/check.Password.validity";
import IssueAccessAndRefreshToken from "../../utils/issue.JWT.tokens";
import { decode, JwtPayload } from "jsonwebtoken";
import RefreshToken from "../../models/refresh_token.model";

const loginUser: RouteParamsHandler = async (req, res, next) => {
  // Validate login credentials
  try {
    const loginValidateSchema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
    });

    const { error } = loginValidateSchema.validate(req.body);

    if (error) return next(CustomErrorHandler.serverError(error.message));

    // find user in database
    try {
      // find the user
      const user = await User.findOne({ email: req.body.email });

      if (!user) return next(new Error("User not found"));

      // is user verified
      if (!user.verified)
        return next(CustomErrorHandler.unAuthorized("User is not verified"));

        // check password entered by user
      const IsPasswordValid = await CheckPasswordValidity(
        user.id,
        req.body.password,
        user.password
      );

      // Issue Access and Refresh Token
      if (IsPasswordValid) {
        // find the refresh token with the specific user id
        const ExistingRefreshToken = await RefreshToken.findOne({
          userId: user.id,
        });

        // if the refresh token exists then make that refresh token invalid 
        // in order to issue new refresh token
        if (ExistingRefreshToken?.status === "valid") {
          ExistingRefreshToken.status = "invalid";
          await ExistingRefreshToken.save();
        }

        // access and refresh token
        const accessToken = await IssueAccessAndRefreshToken.issueAccessToken(
          user._id
        );
        const refreshToken = await IssueAccessAndRefreshToken.issueRefreshToken(
          user._id
        );

        // ! Implementing Refresh token cycle
        // decoding refresh token to check validity
        const decoded = decode(refreshToken as string, { complete: true });

        if (!decoded) {
          throw new Error("Invalid refresh token");
        }

        const { payload } = decoded as { payload: JwtPayload };

        const expiresAt = payload.exp;

        // response
        await RefreshToken.create({
          refreshToken: refreshToken,
          expiresAt: expiresAt,
          status: "valid",
          userId: user._id,
        });
        res.status(200).json({
          message: "User Login Successfully",
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } else {
        throw new Error("Password is wrong");
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    return next(error);
  }
};

export default loginUser;
