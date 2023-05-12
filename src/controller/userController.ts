import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserInstance } from "../model/userModel";
import {
  GenerateSalt,
  GenerateSignature,
  GeneratePassword,
  validatePassword,
  verifySignature,
} from "../utils";
import { UserAttributes, UserPayload } from "../interface/userAttribute";
import { v4 as UUID } from "uuid";

/* =============SIGNUP=======================. */

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstName, password, lastName } = req.body;
    const uuiduser = UUID();

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    //check if user already exists using key value pairs in the object
    const userCheck = await UserInstance.findOne({ where: { email: email } });
    //Create User
    if (!userCheck) {
      let newUser = (await UserInstance.create({
        id: uuiduser,
        email,
        firstName,
        lastName,
        password: userPassword,
        salt,
        role: "user",
        verified: false,
        is_premium: false,
      })) as unknown as UserAttributes;
      const token = await GenerateSignature({
        id: newUser.id,
        email: newUser.email,
        verified: newUser.verified,
        role: newUser.role,
        is_premium: false,
    
      });

      return res.status(201).json({
        message:
          "User created successfully, check your email to activate you account",
        token,
      });
    } else {
      //User already exists
      throw { code: 400, message: "User already exists" };
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
/* =============LOGIN=======================. */
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;
    if (!User) {
      throw { code: 400, message: "Invalide Email or Password" };
    } else {
    //   if (!User.verified) throw { code: 400, message: "Account Not Activated" };
      //validate password

      const validPassword = await validatePassword(
        password,
        User.password,
        User.salt
      );

      if (!validPassword)
        throw { code: 400, message: "Invalide Email or Password" };
      //updated loggedin status
      (await UserInstance.update(
        {
          isLoggedIn: true,
        },
        {
          where: {
            email: email,
          },
        }
      )) as unknown as UserPayload | UserAttributes;
      const loggedinUser = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;
      const payload: UserPayload = {
        id: loggedinUser.id,
        email: loggedinUser.email,
        verified: loggedinUser.verified,
        isLoggedIn: loggedinUser.isLoggedIn,
        role: loggedinUser.role,
        is_premium: loggedinUser.is_premium,
      };
      const signature = await GenerateSignature(payload);

      return res.status(200).json({
        message: "Login Successful",
        signature: signature,
        user: User,
      });
    }
  } catch (error) {
    next(error);
    console.log(error);
    
  }
};

/* =============UPDATE=======================. */
export const update = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
      console.log("id heeeeeeeeee");
    const id = req.user.id;
    
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    const { firstName, lastName, email, country, gender, day, month, year, currency, social,  } =
      req.body;
    const date_birth =
      day && month && year ? new Date(`${month} ${day}, ${year}`) : null;
    // Number(date_birth.slice(3, 5)),
    // Number(date_birth.slice(0, 2))

    if (!User) throw { code: 401, message: "unAuthorised please Login" };
    const updatedUser = (await UserInstance.update(
      {
        firstName: firstName || User.firstName,
        lastName: lastName || User.lastName,
        email: email || User.email,
        country: country || User.country,
        gender: gender || User.gender,
        date_birth: date_birth || User.date_birth,
        day: day || User.day,
        month: month || User.month,
        year: year || User.year,
      },
      { where: { id: id } }
    )) as unknown as UserAttributes;

    if (updatedUser) {
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;

      return res.status(200).json({
        message: "You have successfully updated your profile",
        User,
      });
    }
    throw { code: 500, message: "Something went wrong" };
  } catch (error) {
    console.log(error);
    // next(error);
  }
};

export const updateUserProfile = async (req: JwtPayload, res: Response) => {
    try {
      const id = req.user.id;
      const { firstName, lastName, address, phone } = req.body;
  
      //Joi validation
      //Check if the user is a registered user
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;
      if (!User) {
        return res.status(400).json({
          Error: "You are not authorized to update your profile",
        });
      }
      const updatedUser = (await UserInstance.update(
        { firstName, lastName, address,  },
        { where: { id: id } }
      )) as unknown as UserAttributes;
  
      if (updatedUser) {
        const User = (await UserInstance.findOne({
          where: { id: id },
        })) as unknown as UserAttributes;
        return res.status(200).json({
          message: "You have successfully updated your profile",
        });
      }
      return res.status(400).json({
        Error: "An error occurs",
      });
    } catch (error) {
      return res.status(500).json({
        Error: "Internal server Error",
        route: "users/update-user-profile",
      });
    }
  };

/*================= verify User ================*/
export const verifyUser = async (req: Request, res: Response) => {
    try {
      const token = req.params.signature;
      const decode = await verifySignature(token);
  
      //check if the user is a registered user
      const User = (await UserInstance.findOne({
        where: { email: decode.email },
      })) as unknown as UserAttributes;
  
      if (User) {
        const { otp } = req.body;
        if (User.otp === otp) {
          const updatedUser = (await UserInstance.update(
            {
              verified: true,
            },
            { where: { email: decode.email } }
          )) as unknown as UserAttributes;
  
          //Regenerate a new signature
          let signature = await GenerateSignature({
            id: updatedUser.id,
            email: updatedUser.email,
            verified: updatedUser.verified,
          });
  
          if (updatedUser) {
            const User = (await UserInstance.findOne({
              where: { email: decode.email },
            })) as unknown as UserAttributes;
  
            return res.status(200).json({
              message: "Your account has been verified successfully",
              signature,
              role: User.role,
              verified: User.verified,
            });
          }
        }
        return res.status(400).json({
          Error: "Invalid credentials",
        });
      }
    } catch (err) {
      res.status(500).json({
        Error: `Internal server Error ${err}`,
        route: "/user/user-verify",
      });
    }
  };
/*================= logout======================*/
export const logout = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  await UserInstance.update(
    {
      isLoggedIn: false,
    },
    {
      where: { id: id },
    }
  );
  return res.status(200).json({
    message: "Successfuly Loggedout",
  });
};
