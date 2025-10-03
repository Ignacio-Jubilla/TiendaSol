import { config } from "dotenv";
config();
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_NAME = process.env.MONGODB_NAME || "tiendaSol"
export default {
  PORT,
  MONGODB_URI,
  MONGODB_NAME
}

console.log(`mongoDB uri: ${MONGODB_URI}`);
console.log(`mongoDB name: ${MONGODB_NAME}`);