import nodemailer from "nodemailer";
import { FromAdminMail, GMAIL_PASS, GMAIL_USER, userSubject } from "../config";

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
});

export const mailSent = async (
    from: string,
    to: string,
    subject: string,
    html: string
  ) => {
    try {
      const response = await transport.sendMail({
        from: FromAdminMail,
        to,
        subject: userSubject,
        html,
      });
      return response;
    } catch (err) {
      console.log(err);
    }
};

export const emailHtml = (otp: string) => {
    let response = `
      <div style="max-width:700px;
      margin:auto;
      border:10px solid #ddd;
      padding:50px 20px;
      font-size: 110%;
      font-style: italics
      "> 
      <h2 style="text-align:center;
      text-transform:uppercase;
      color:teal;
      ">
      User Auth
      </h2>
      <p>${otp} </p>
      <p>Hi there, use the otp to verify your account.</p>
      <h3>DO NOT DISCLOSE TO ANYONE<h3>
      </div>
      `
    return response;
};