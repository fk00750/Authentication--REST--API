import nodemailer, { TransportOptions } from "nodemailer";
import { google } from "googleapis";
import { sign } from "jsonwebtoken";
import emailVerificationSecretModel from "../models/email.Secret.model";
import { ObjectId, Types } from "mongoose";
import { randomFillSync } from "crypto";

const CLIENT_ID: string =
  "421790989978-5skiqkdong3fp3p9a5h35fb0n59jgkqk.apps.googleusercontent.com";
const CLIENT_SECRET: string = "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";
const REDIRECT_URL: string = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN: string =
  "1//04GZQBOgoN4aLCgYIARAAGAQSNwF-L9IrGoV6y1pYXNf6l9wuuWypRcm_hTCkzydCreN4virip5jH_vpxH4HidwvEhfNUfEkZHmY";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 * @function sendVerificationMail
 * @param receiver - who receives email
 * @param verificationUrl - verification url
 * @returns
 */

async function sendVerificationMail(receiver: string, verificationUrl: string) {
  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "fk7384329@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: access_token,
      },
    } as TransportOptions);

    const mailOptions = {
      from: "<fk7384329@gmail.com>",
      to: receiver,
      subject: "Verify Email",
      text: "Verify Your Email",
      html: `<h1>Verify Your Email</h1><p>Please click the following link to verify your email address:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

/**
 * @function generateEmailVerificationToken - Generate and store token for email verification
 * @param {string} userId - User id for payload
 * @param {string} email - User email for payload
 * @returns - it returns a string of hashed token with expire limit of 15m
 */

const generateEmailVerificationToken = async function (
  userId: string,
  email: string
) {
  try {
    const payload = {
      userId,
      email,
    };

    const verificationBuffer = Buffer.alloc(32);
    randomFillSync(verificationBuffer);
    const verificationSecret = verificationBuffer.toString("hex");

    const secret = verificationSecret;

    await new emailVerificationSecretModel({
      userId: userId,
      secret: secret,
    }).save();

    const verificationToken = sign(payload, secret, { expiresIn: "15m" });
    return verificationToken;
  } catch (error) {
    return error;
  }
};

export { sendVerificationMail, generateEmailVerificationToken };
