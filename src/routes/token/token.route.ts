import express from "express";
import passport from "passport";
import { GenerateTokens } from "../../controllers";
import admin from "../../middleware/admin";

const TokenRouter = express.Router();

TokenRouter.get(
  "/generate-tokens",
  [passport.authenticate("jwt-access", { session: false }), admin],
  GenerateTokens
);

export default TokenRouter;
