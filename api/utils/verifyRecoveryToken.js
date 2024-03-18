import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyRecoveryToken = (req, res, next) => {
  const token = req.cookies.recovery_token;
  console.log(token);

  if (!token) {
    return next(errorHandler(401, "Unauthorized User"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(errorHandler(401, "Token Expired"));
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return next(errorHandler(401, "Invalid Token"));
      }
      return next(errorHandler(401, "Unauthorized User"));
    }

    req.user = decoded;
    next();
  });
};
