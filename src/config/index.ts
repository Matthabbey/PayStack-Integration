import dotenv from 'dotenv'
import merge from "lodash.merge";
dotenv.config()

//making sure NODE_ENV is set, defult is "developement"
// process.env.NODE_ENV = process.env.NODE_ENV || "developement";
//set stage
const stage = process.env.STAGE || "local";
let envConfig;
//dynamically require each config depending on the stage we are in
if (stage === "production") {
  //set config to production
  envConfig = require("./prod").default;
} else if (stage === "testing") {
  envConfig = require("./testing").default;
} else {
  envConfig = require("./local").default;
}
// export along with marge
export default merge(
  {
    stage,
  },
  envConfig
);


export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_PASS = process.env.GMAIL_PASS;
export const FromAdminMail = process.env.FromAdminMail as string;
export const userSubject = process.env.usersubject as string;