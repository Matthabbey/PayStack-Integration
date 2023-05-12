import express from "express";
import { Register, signin, updateUserProfile, update } from "../controller/userController";
import { authentication } from "../middlewares/authentication";
import { logout, verifyUser } from "../controller/userController";
import { RegisterUserJoi, loginUserJoi } from "../utils";


const userRouter = express.Router();

userRouter.post("/signup", RegisterUserJoi, Register);
userRouter.post("/signin", loginUserJoi, signin);




userRouter.get("/update", authentication, update );
userRouter.patch("/verify/:signature", verifyUser);
userRouter.get("/logout", authentication, logout);

export default userRouter


