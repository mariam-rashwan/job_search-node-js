import express from "express";
import {
  SignIn,
  SignUp,
  deleteUser,
  forgetPassword,
  getByIdUserData,
  getByRecoveryEmail,
  getUserData,
  resetPassword,
  updateUserData,
  updateUserPassword,
} from "./controller/user.controller.js";
import { validation } from "./../../middleware/validation.js";
import {
  addUserSchema,
  emailSchema,
  getByIdSchema,
  recoveryEmailSchema,
  resetPasswordSchema,
  signInSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "./user.validation.js";
import { auth } from "../../middleware/auth.js";

const routes = express.Router();

// Auth ===========>

routes.post("/auth/signUp", validation(addUserSchema), SignUp);

routes.post("/auth/signIn", validation(signInSchema), SignIn);

// forget password ===========>

routes.post("/auth/forgetPassword", validation(emailSchema), forgetPassword);

routes.post(
  "/auth/resetPassword",
  validation(resetPasswordSchema),
  resetPassword
);

// user data ===========>
// update
// delete
// get =>with auth

routes
  .route("/")
  .patch(auth, validation(updateUserSchema), updateUserData)
  .delete(auth, deleteUser)
  .get(auth, getUserData);

//get user profile with id
routes.get("/:id", auth, validation(getByIdSchema), getByIdUserData);

//update password
routes.put(
  "/update-password",
  auth,
  validation(updatePasswordSchema),
  updateUserPassword
);

// accounts associated to a specific recovery Email
routes.get(
  "/mail/:recoveryEmail",
  auth,
  validation(recoveryEmailSchema),
  getByRecoveryEmail
);

export default routes;
