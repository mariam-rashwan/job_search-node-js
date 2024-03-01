import jwt, { decode } from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const auth = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (
    !authorization ||
    (authorization && authorization.startsWith("Bearer") == false)
  ) {
    return next(new AppError("No token provided ,login first", 401));
  } else {
    let token = authorization.split(" ")[1];
    if (!token)
      return next(new AppError("No token provided ,login first", 401));
    jwt.verify(token, process.env.SECRET_KEY_AUTH, (err, decode) => {
      if (err) {
        return next(new AppError("invalid user token", 403));
      } else {
        req.userId = decode.id;
        req.role = decode.role;
        req.status = decode.status;
        next();
      }
    });
  }
};
