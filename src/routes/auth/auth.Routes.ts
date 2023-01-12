import express from "express";
import passport from "passport";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  RefreshTokenHandler,
  registerUser,
  updatePassword,
  verifyUserEmail,
} from "../../controllers";
import dashboard from "../../controllers/auth/dashboard";
import verifyUrl from "../../middleware/verify.Url";

const AuthRouter = express.Router();

/**
 * register user
 * login user
 * logout user
 * refresh token generator
 * dashboard
 * forgot password
 * update password
 */

AuthRouter.post("/auth/register", registerUser)
  .post("/auth/login", loginUser)
  .post(
    "/auth/logout",
    passport.authenticate("jwt-access", { session: false }),
    logoutUser
  )
  .get(
    "/auth/refresh",
    passport.authenticate("jwt-refresh", { session: false }),
    RefreshTokenHandler
  )
  .get(
    "/dashboard",
    passport.authenticate("jwt-access", { session: false }),
    dashboard
  )
  .get("/verify-email/:id/:token", verifyUserEmail)
  .post("/forgot-password", forgotPassword)
  .post("/update-password/:id/:token", [verifyUrl], updatePassword);

export default AuthRouter;
