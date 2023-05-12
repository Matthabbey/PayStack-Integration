import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { connectToDatabase, db } from "./config/db";
import dotenv from "dotenv";
import  userRouter from "./routes/users";
import adminRouter from "./routes/adminRoute";
import paystackRoute from "./routes/paymentRoute";
dotenv.config();


//Sequelize connection to dataBase
connectToDatabase()


const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Routes
app.use("/admin", adminRouter)
app.use("/users", userRouter);
app.use("/users/", paystackRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
