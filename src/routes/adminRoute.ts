import express from "express";
import { authentication } from "../middlewares/authentication";
import { logout } from "../controller/userController";
import { RegisterUserJoi, loginUserJoi } from "../utils";
import { AdminLogin, AdminRegister, getAllUsers } from "../controller/adminController";


const adminRouter = express.Router();

adminRouter.post("/signup", RegisterUserJoi, AdminRegister);
adminRouter.post("/signin", loginUserJoi, AdminLogin);
adminRouter.get("/getusers", authentication, getAllUsers );
adminRouter.get("/logout", authentication, logout);

export default adminRouter


