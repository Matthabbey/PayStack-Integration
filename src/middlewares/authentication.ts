import { Response, Request, NextFunction } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { UserInstance } from "../model/index";
import { UserAttributes, UserPayload } from "../interface/";
import config from "../config";

export const authentication = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("here now");
    const authorization = req.headers.authorization as string;
    if (!authorization) {
      throw {
        code: 401,
        message: "Not Authorised",
      };
    }

    const token = authorization.slice(7, authorization.length);
    let verified: UserPayload = jwt.verify(
      token,
      config.APP_SECRETE as string
    ) as UserPayload;
    if (!verified) throw { code: 401, message: "Not Authorised" };
    const { id } = verified as UserPayload;

    const user = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;
    if (!user) throw { code: 400, message: "Invalide Credentials" };
    if (!user.verified) throw { code: 400, message: "Account Not Activated" };
    if (!verified.isLoggedIn) throw { code: 400, message: "Not Authenticated" };
    req.user = verified;
    next();
  } catch (error: Error | any) {
    next({ code: 400, message: error.message });
  }
};
