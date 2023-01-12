// verify user link
// update user password

import { verify } from "jsonwebtoken";
import emailVerificationSecretModel from "../../models/email.Secret.model";
import User from "../../models/user.Model";
import RouteParamsHandler from "../../types/RouteParams.type";

const updatePassword: RouteParamsHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    await User.findOneAndUpdate({ email }, { password });

    res.send("Password Updated Successfully");
  } catch (error) {
    res.send("Password update Failed");
  }
};

export default updatePassword;
