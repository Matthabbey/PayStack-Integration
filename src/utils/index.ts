import jwt from "jsonwebtoken";
import config from "../config";
import { UserPayload } from "../interface/userAttribute";
import joi from "joi";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const GenerateSignature = async (
  payload:
    | UserPayload
    | { [key: string]: string | number | undefined | boolean }
) => {
  return jwt.sign(payload, config.APP_SECRETE, { expiresIn: "20d" });
};

export const verifySignature = async (signature: string) => {
  return jwt.verify(signature, config.APP_SECRETE) as JwtPayload;
};

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const updateUserJoi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updateSchema = joi.object().keys({
    firstName: joi.string(),
    lastName: joi.string(),
    address: joi.string(),
    country: joi.string(),
    password: joi.string(),
    currency: joi.string(),
  });
  const check = updateSchema.validate(req.body, option);
  if (check.error) {
    return res.status(400).json({ code: 400, error: check.error.message });
  } else {
    next();
  }
};

export const loginUserJoi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginSchema = joi.object().keys({
    email: joi.string().required(),
    password: joi.string().min(4),
  });
  const check = loginSchema.validate(req.body, option);
  if (check.error) {
    return res.status(400).json({ code: 400, error: check.error.message });
  } else {
    next();
  }
};

export const RegisterUserJoi = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const registerSchema = joi.object().keys({
    email: joi.string().email().required(),
    firstName: joi.string().min(5).required(),
    lastName: joi.string().required(),
    password: joi
      .string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirm_password: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });

  const check = registerSchema.validate(req.body, option);
  if (check.error) {
    return res.status(400).json({ code: 400, error: check.error.message });
  } else {
    next();
  }
};
export const loginSchema = joi.object().keys({
    email: joi.string().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const adminSchema = joi.object().keys({
    email: joi.string().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    //role:joi.string().required(), 
});

export const GenerateOTP = ()=>{
    const otp = Math.floor(1000 + Math.random() * 9000).toString() 
    return {otp};
  }
  
