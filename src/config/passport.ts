import User from "../models/user.Model";
import fs from "fs";
import path from "path";
import passport, { PassportStatic } from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { Model, model } from "mongoose";

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

interface IUser {
  Id?: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

// access token key
const pathToAccKey: string = path.join(__dirname, "../..", "access_public.pem");
const ACCESS_PUB_KEY: string = fs.readFileSync(pathToAccKey, "utf-8");

// access token key
const RpathToRefKey: string = path.join(
  __dirname,
  "../..",
  "refresh_public.pem"
);
const Refresh_PUB_KEY: string = fs.readFileSync(RpathToRefKey, "utf-8");


const passportStrategy = (
  passport: passport.PassportStatic,
  usageName: string,
  PUB_KEY: string
) => {
  passport.use(
    usageName,
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: PUB_KEY,
        algorithms: ["RS256"],
      },  
      async (jwt_payload: JwtPayload, done: Function) => {
        User.findOne(
          { _id: jwt_payload.sub },
          (error: Error, user: Model<IUser>) => {
            // the error has occured while finding the user
            if (error) return done(error, false);

            // the user document is found
            if (user) done(null, user);
            else done(null, false); // the user is null
          }
        );
      }
    )
  );
};

const passportConfig = (passport: PassportStatic) => {
  passportStrategy(passport, "jwt-access", ACCESS_PUB_KEY),
    passportStrategy(passport, "jwt-refresh", Refresh_PUB_KEY);
};

export default passportConfig;
