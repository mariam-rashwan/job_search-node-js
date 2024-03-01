import { handleError } from "../../../middleware/handleError.js";
import userModel from "../../../../DB/models/user.model.js";
import { AppError } from "../../../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import otpModel from "./../../../../DB/models/otp.model.js";

// 1-concate first&last name in username
//  2-check (email,phone) if excist in database
//   3-hashedPassword
//    4-added it

const SignUp = handleError(async (req, res, next) => {
  let {
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    recoveryEmail,
    role,
    DOB,
  } = req.body;
  req.body.username = firstName + "_" + lastName;
  const excistmail = await userModel.findOne({ email });
  const excistphone = await userModel.findOne({ mobileNumber });
  if (excistmail) {
    return next(new AppError("user email already exist", 409));
  }
  if (excistphone) {
    return next(new AppError("user mobileNumber already exist", 409));
  }
  let hashedPassword = bcrypt.hashSync(
    password,
    Number(process.env.SALTROUNDS)
  );
  req.body.password = hashedPassword;
  let newUser = new userModel(req.body);
  const added = await newUser.save();
  return res.status(201).json({ message: "Succes", added });
});

//  1-check (email,phone) if excist in database
//   3-check Password
//    4-if matched data
//     5-make status=>online
//      6-generate token with id,role

const SignIn = handleError(async (req, res, next) => {
  let { email, password, mobileNumber } = req.body;
  let excistUser;
  //conditions 2=>not  1=>validate
  if ((email && mobileNumber) || (!email && !mobileNumber)) {
    return next(new AppError("please add email or mobileNumber", 400));
  }
  if (email) {
    excistUser = await userModel.findOne({ email });
    if (!excistUser)
      return next(new AppError("user email not exist, Regest first", 401));
  }
  if (mobileNumber) {
    excistUser = await userModel.findOne({ mobileNumber });
    if (!excistUser)
      return next(
        new AppError("user mobileNumber not exist, Regest first", 401)
      );
  }
  const matchedPass = bcrypt.compareSync(password, excistUser.password);
  if (matchedPass) {
    let filter = email
      ? { email: req.body.email }
      : { mobileNumber: req.body.mobileNumber };
    await userModel.findOneAndUpdate(
      filter,
      { status: "online" },
      { new: true }
    );
    let token = jwt.sign(
      {
        id: excistUser["_id"],
        role: excistUser.role,
        status: excistUser.status,
      },
      process.env.SECRET_KEY_AUTH
    );
    res.status(200).json({ message: "Succes", token });
  } else {
    return next(new AppError("wrong user Password", 400));
  }
});

// 1-check if excist user with this id
// 2-make sure if change firstName must change lastName
//    or not change any of then =>
// 3- check (email,phone) if excist in another user
//        and if excist in the same user not problem
// 4- then data and update :)'DONE
//

const updateUserData = handleError(async (req, res, next) => {
  let { firstName, lastName, email, mobileNumber, recoveryEmail, DOB } =
    req.body;
  let excistUser = await userModel.findById(req.userId);
  if (!excistUser || req.role !== "User") {
    return next(
      new AppError(
        "only the owner of the account can update his account data",
        403
      )
    );
  }

  if (firstName && !lastName) {
    return next(new AppError("last name is required", 400));
  } else if (!firstName && lastName) {
    return next(new AppError("First name is required", 400));
  }
  if (firstName && lastName) req.body.username = firstName + "_" + lastName;

  if (email) {
    const excistUserMAil = await userModel.findOne({ email });

    if (excistUserMAil && excistUserMAil._id != req.userId) {
      return next(new AppError("user email already excist", 409));
    }
  }
  if (mobileNumber) {
    const excistUserPhone = await userModel.findOne({ mobileNumber });
    if (excistUserPhone && excistUserPhone._id != req.userId)
      return next(new AppError("user mobileNumber already exist", 409));
  }
  const updated = await userModel.findByIdAndUpdate(
    req.userId,
    { firstName, lastName, email, mobileNumber, recoveryEmail, DOB },
    {
      new: true,
    }
  );

  return res.status(200).json({ message: "Succes", updated });
});

// 1-check if excist user with this id
// 2- find user with id and delete him
//     if excist

const deleteUser = handleError(async (req, res, next) => {
  if (!req.userId || req.role !== "User") {
    return next(
      new AppError(
        "only the owner of the account can delete his account data",
        403
      )
    );
  }
  const deleted = await userModel.findByIdAndDelete(req.userId);
  deleted &&
    res
      .status(200)
      .json({ message: "Succes", deleted: "user has been deleted" });
  !deleted && next(new AppError("user not found", 404));
});

// 1-check if excist user with this id
// 2-find by id =>true => sucess : error

const getUserData = handleError(async (req, res, next) => {
  if (!req.userId || req.role !== "User") {
    return next(
      new AppError(
        "only the owner of the account can get his account data",
        403
      )
    );
  }
  //  moreeeee details
  if (req.status !== "online") {
    return next(new AppError("signin first", 401));
  }

  const userData = await userModel.findById(req.userId);
  userData && res.status(200).json({ message: "Succes", userData });
  !userData && next(new AppError("user not found", 404));
});

// 1-get id from params
// 2-find by id =>true => sucess : error

const getByIdUserData = handleError(async (req, res, next) => {
  let { id } = req.params;
  const userData = await userModel.findById(id);
  userData && res.status(200).json({ message: "Succes", userData });
  !userData && next(new AppError("user not found", 404));
});

// find with recoveryEmail

const getByRecoveryEmail = handleError(async (req, res, next) => {
  const excistUser = await userModel.findById(req.userId);
  if (!excistUser) {
    return next(new AppError("user not found", 401));
  }
  let { recoveryEmail } = req.params;
  const data = await userModel.find({ recoveryEmail });
  data.length && res.status(200).json({ message: "Succes", data });
  !data.length &&
    next(
      new AppError(
        `no accounts founded with recovery Email :${recoveryEmail}`,
        404
      )
    );
});

// 1-check if excist user with this id
// 2-set in req.body current & new passs
// 3-compare the old pass if match in db
// 4- compare the new pass if changed
// 5- hash password
// 6- update the pass

const updateUserPassword = handleError(async (req, res, next) => {
  if (!req.userId) {
    return next(
      new AppError(
        "only the owner of the account can get his account data",
        403
      )
    );
  }

  let { currentPassword, newPassword } = req.body;

  const excistUser = await userModel.findById(req.userId);

  if (!excistUser) {
    return next(new AppError("user not found", 404));
  }

  const matchedPass = bcrypt.compareSync(currentPassword, excistUser.password);

  if (!matchedPass) {
    return next(new AppError("current password not correct", 401));
  }
  const matchedNewPass = bcrypt.compareSync(newPassword, excistUser.password);

  if (matchedNewPass) {
    return next(new AppError("enter new password", 400));
  }

  let hashedPassword = await bcrypt.hashSync(
    newPassword,
    Number(process.env.SALTROUNDS)
  );

  const updated = await userModel.findByIdAndUpdate(
    req.userId,
    { password: hashedPassword },
    {
      new: true,
    }
  );
  updated &&
    res.status(200).json({ message: "Succes", updated: "password updated" });
  !updated && next(new AppError("user not found", 404));
});

// logic
//1- take email from req.body to check if user excist
//2- excist :true => make him offline
//                =>generate otp from otp-generator package
//                => insert data into otp model that has email,
//                otp , create at that expires after 5 munits then deleted
//                => sucess && make a res =>(otp , email )=>sucess

const forgetPassword = handleError(async (req, res, next) => {
  let { email } = req.body;

  const excistUser = await userModel.findOne({ email });
  if (!excistUser) {
    return next(new AppError("user not found", 404));
  }
  let { status } = excistUser;

  await userModel.findOneAndUpdate({ email }, { status: "offline" });

  let otp = otpGenerator.generate(parseInt(process.env.OTP_LENGTH), {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  //  req.body.otp = otp;
  const newOtp = new otpModel({ email, otp });
  const added = await newOtp.save();
  let otpData = await otpModel.findOne({ email, otp }).select("email otp -_id");
  otpData && res.status(200).json({ message: "Succes", otpData });
  !otpData && next(new AppError("user not found", 404));
});

// logic
//1- take password & otp from req.body to reset pass
//2- find with otp in otpModel if excist &&
//                => hash password
//                => find with email from otpModel in userModel
//                excist ? update with new hashed password
//                 => res with success and logn

const resetPassword = handleError(async (req, res, next) => {
  const { password, otp } = req.body;
  const excistOtp = await otpModel.findOne({ otp });
  if (!excistOtp) {
    return next(
      new AppError(
        "otp has expired or not correct :(' ,it's expired in 5 minuts",
        404
      )
    );
  }
  let { email } = excistOtp;

  let hashedPassword = bcrypt.hashSync(
    password,
    Number(process.env.SALTROUNDS)
  );
  await userModel.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Succes", data: "please login with new password" });
});

export {
  SignUp,
  SignIn,
  updateUserData,
  deleteUser,
  getUserData,
  getByIdUserData,
  updateUserPassword,
  getByRecoveryEmail,
  forgetPassword,
  resetPassword,
};
