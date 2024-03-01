import { AppError } from "../utils/AppError.js";

export const checkRole = (role) => {
  return (req, res, next) => {
    const userRole = req.role;

    if (role === "both") {
      return next();
    }
    if (userRole == role) {
      return next();
    } else {
      return next(
        new AppError("Unauthorized access ,Not allowed to acces", 403)
      );
    }
  };
};
