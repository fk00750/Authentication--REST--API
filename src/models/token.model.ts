import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
  name: {
    type: String,
    default: "MyToken",
  },
  symbol: {
    type: String,
    default: "MYT",
  },
  totalSupply: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    default: "admin",
  },
  balanceOf: {
    type: Map,
    of: Number,
  },
});

const Token = model("Token", TokenSchema);
export default Token;
