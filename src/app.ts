import express, { Application, Request, Response, NextFunction } from "express";
import errorHandler from "./middleware/error.Handler";
import AuthRouter from "./routes/auth/auth.Routes";
import path from "path";
import cookieParser from "cookie-parser";
import passportConfig from "./config/passport";
import passport from "passport";
import TokenRouter from "./routes/token/token.route";
import BlogRouter from "./routes/blogs/blog.Routes";
import UserRouter from "./routes/user/admin.User.Routes";

passportConfig(passport);

const app: Application = express();

// Initialize passport
app.use(passport.initialize());

// cookie
app.use(cookieParser());

//setting view engine to ejs
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "../views"));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Auth Routes
app.use("/", AuthRouter);
app.use("/tokens", TokenRouter);
// Blog Routes
app.use("/blog", BlogRouter);
// user management route
app.use("/admin", UserRouter);

// Home route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Welcome");
});

// Error Handler Middleware
app.use(errorHandler);

export default app;
