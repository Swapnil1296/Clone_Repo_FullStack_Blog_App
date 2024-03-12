import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // const decoded = jwt.verify(
  //   token,
  //   process.env.JWT_SECRET_KEY || "",
  //   (err, decoded) => {

  // );

  if (!token) {
    return next(errorHandler(401, "Unauthriozed User"));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ statusCode: 401, message: "Token Expired" });
      console.log("Unauthorized! Access Token was expired!");
      return next(errorHandler(401, "Unauthorized! Access Token was expired!"));
    }
    if (err instanceof jwt.NotBeforeError) {
      console.log("Unauthorized! Access Token was expired!");
      return next(errorHandler(401, "jwt not active"));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      console.log("Unauthorized! Access Token was expired!");
      return next(errorHandler(401, "jwt malformed"));
    }

    if (err) {
      console.log("Unauthorized! Access Token was expired!");
      return next(errorHandler(401, "Unauthriozed User"));
    }

    req.user = user;
    next();
  });
};
