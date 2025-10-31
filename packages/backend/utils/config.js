import { config } from "dotenv";
config();
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_NAME = process.env.MONGODB_NAME || "tiendaSol"
const JWT_SECRET = process.env.JWT_SECRET_KEY
const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP
const REFRESH_TOKEN_EXP = process.env.REFRESH_TOKEN_EXP
export default {
  PORT,
  MONGODB_URI,
  MONGODB_NAME,
  JWT_SECRET,
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP
}