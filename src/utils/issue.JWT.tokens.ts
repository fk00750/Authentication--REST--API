import { sign } from "jsonwebtoken";
import { join } from "path";
import { readFileSync } from "fs";
import { Types } from "mongoose";

// access token key
const pathToKey = join(__dirname, "../..", "access_private.pem");
const ACCESS_PRIV_KEY = readFileSync(pathToKey, "utf8");
// refresh token key
const pathToRefreshKey = join(__dirname, "../..", "refresh_private.pem");
const REFRESH_PRIV_KEY = readFileSync(pathToRefreshKey, "utf-8");

/**
 * @class IssueAccessAndRefreshToken - issue access and refresh token
 * @method issueAccessToken - issue access token
 * @method issueRefreshToken - issue refresh token
 */

class IssueAccessAndRefreshToken {
  static ACCESS_PRIV_KEY = ACCESS_PRIV_KEY;
  static REFRESH_PRIV_KEY = REFRESH_PRIV_KEY;

  static async issueToken(
    userId: Types.ObjectId,
    privKey: string,
    expiresIn: string
  ) {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
    };

    return sign(payload, privKey, { expiresIn: expiresIn, algorithm: "RS256" });
  }

  static async issueAccessToken(userId: Types.ObjectId) {
    return this.issueToken(userId, this.ACCESS_PRIV_KEY, "50s");
  }

  static async issueRefreshToken(userId: Types.ObjectId) {
    return this.issueToken(userId, this.REFRESH_PRIV_KEY, "1y");
  }
}

export default IssueAccessAndRefreshToken;
