import dotenv from "dotenv";
dotenv.config();
export default {
  DATABASE_URL: process.env.LOCAL_DATABASE_URL,
  APP_SECRETE: process.env.LOCAL_APP_SECRETE,
  JWT_SECRETE: process.env.LOCAL_JWT_SECRETE,
  DATABASE_USERNAME: process.env.LOCAL_DATABASE_USERNAME,
  DATABASE_HOST: process.env.LOCAL_DATABASE_HOST,
  DATABASE_DATABASE_NAME: process.env.LOCAL_DATABASE_DATABASE_NAME,
  DATABASE_PASSWORD: process.env.LOCAL_DATABASE_PASSWORD,
  DATABASE_PORT: process.env.LOCAL_DATABASE_PORT,
  PAYSTACK_SECRET: process.env.PAYSTACK_SECRET_KEY,
  PAYSTACK_URL: process.env.PAYSTACK_BASE_URL,
  dialectOptions: null,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS,
  FromAdminMail: process.env.FromAdminMail as string,
  userSubject: process.env.usersubject as string,
};

console.log("running local mode");
