import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import User from "../models/User.model";
import {
  LoginDTO,
  RegisterUserDTO,
  resendOtpDTO,
  ResetPasswordDTO,
  verifyOtpDTO,
} from "../dtos/auth.dto";
import userService from "../services/user.service";
import {
  EmailDriver,
  EmailTemplate,
  OtpType,
  PasswordType,
  UserType,
  VerifyOTP,
} from "../utils/enums.util";
import emailService from "../services/email.service";
import tokenService from "../services/token.service";
import { IUserDoc } from "../utils/interface.util";
import userRepository from "../repositories/user.repository";

/**
 * @name registerUser
 * @description Registers a new user
 * @route POST /auth/register
 * @access Public
 * @returns registered user
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, userType }: RegisterUserDTO =
      req.body;

    const validate = await userService.validateRegister(req.body);
    if (validate.error) {
      return next(
        new ErrorResponse("Error", validate.code!, [validate.message])
      );
    }

    const mailCheck = await userService.checkEmail(email);
    if (!mailCheck) {
      return next(
        new ErrorResponse("Error", 400, ["a valid email is required"])
      );
    }

    const userExist = await User.findOne({ email: email.toLowerCase() });
    if (userExist) {
      return next(
        new ErrorResponse("email already exist, use another email", 400, [
          "Error",
        ])
      );
    }

    const isSuperadmin = await User.findOne({
      email: email.toLowerCase(),
      userType: UserType.SUPERADMIN,
    });

    if (isSuperadmin) {
      return next(
        new ErrorResponse("Error", 400, ["forbidden!, user already exist"])
      );
    }
    const passwordCheck = await userService.checkPassword(password);
    if (!passwordCheck) {
      return next(
        new ErrorResponse("Error", 400, [
          "password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number",
        ])
      );
    }

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      passwordType: PasswordType.USERGENERATED,
      userType: userType as UserType,
    });
    if (!user) {
      return next(new ErrorResponse("Error", 404, ["user not created"]));
    }

    // Activate the user account and Update login information
    await userService.updateUserType(user, userType as UserType);
    await userService.activateAccount(user);
    await userService.updateLastLogin(user);

    const token = await tokenService.attachToken(user);
    if (token.error) {
      return next(new ErrorResponse("Error", token.code!, [token.message]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          slug: user.slug,
          userType: user.userType,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
          isDeactivated: user.isDeactivated,
          loginLimit: user.loginLimit,
          lastLogin: user.lastLogin,
          id: user._id,
        },
        token: token.data.token,
      },
      message: "user registered successfully",
      status: 200,
    });
  }
);

/**
 * @name loginUser
 * @description Logs in a user
 * @route POST /auth/login
 * @access Public
 */
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginDTO = req.body;

    const validate = await userService.validateLogin(req.body);
    if (validate.error) {
      return next(
        new ErrorResponse("Error", validate.code!, [validate.message])
      );
    }

    const userExist = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!userExist) {
      return next(new ErrorResponse("Error", 400, ["invalid credentials"]));
    }

    // Check if account is locked
    if (await userService.checkLockedStatus(userExist)) {
      return next(
        new ErrorResponse("Error", 423, [
          "Account is locked. Please try again later",
        ])
      );
    }

    // Check if account is deactivated
    if (userExist.isDeactivated) {
      return next(
        new ErrorResponse("Error", 403, ["Account has been deactivated"])
      );
    }

    // check password is correct
    const verifyPassword = await userService.matchEncryptedPassword({
      hash: password,
      user: userExist,
    });
    if (!verifyPassword) {
      await userService.increaseLoginLimit(userExist);
      return next(new ErrorResponse("Error", 400, ["invalid credentials"]));
    }

    // Update login information
    await userService.activateAccount(userExist);
    await userService.updateLastLogin(userExist);
    await userService.updateLoginInfo(userExist, req);

    await userExist.save();

    const token = await tokenService.attachToken(userExist);
    if (token.error) {
      return next(new ErrorResponse("Error", token.code!, [token.message]));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        user: {
          id: userExist.id,
          email: userExist.email,
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          slug: userExist.slug,
          userType: userExist.userType,
        },
        token: token.data.token,
      },
      message: "User logged in successfully.",
      status: 200,
    });
  }
);

/**
 * @name logoutUser
 * @description Logs out a user and invalidates the session/token
 * @route POST /api/auth/logout
 * @access Private
 */
export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id as IUserDoc;
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorResponse("Error", 404, ["User not found"]));
    }

    const result = await tokenService.detachToken(user);
    if (result.error) {
      return next(new ErrorResponse("Error", result.code, [result.message]));
    }

    await tokenService.revokeToken(user);
    await userService.updateLastLogin(user);
    await userService.updateLoginInfo(user, req);

    await user.save();

    return res.status(200).json({
      error: false,
      errors: [],
      message: "User logged out successfully.",
      status: 200,
    });
  }
);

// /**
//  * @name forgotPassword
//  * @description Allows user request OTP to reset their password
//  * @route POST /auth/forgot-password
//  * @access  Public
//  */
// export const forgotPassword = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email } = req.body;

//     if (!userService.checkEmail(email)) {
//       return next(new ErrorResponse("Invalid email format.", 400, []));
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return next(
//         new ErrorResponse("Error", 404, ["User with this email does not exist"])
//       );
//     }

//     // Check if account is locked or deactivated}
//     if (await userService.checkLockedStatus(user)) {
//       return next(
//         new ErrorResponse("Error", 423, [
//           "Account is locked. Please try again later",
//         ])
//       );
//     }

//     if (user.isDeactivated) {
//       return next(
//         new ErrorResponse("Error", 403, ["Account has been deactivated"])
//       );
//     }

//     const OTP = await userService.generateOTPCode(user, OtpType.FORGOTPASSWORD);

//     if (OTP) {
//       const sendOTP = await otpService.sendOTPEmail({
//         // driver: EmailDriver.SENDGRID,
//         // user: user,
//         // template: EmailTemplate.VERIFY_EMAIL,
//         // code: OTP,
//         // options: {
//         //   otpType: VerifyOTP.PASSWORD_RESET,
//         //   salute: `${user.firstName}`,
//         //   bodyOne:
//         //     "You are receiving this email because you requested a password reset. Your OTP code will expire in 10 minutes.",
//         //   bodyTwo: "Please enter the code below to reset your password.",
//         // },
//       });

//       if (sendOTP.error) {
//         return next(
//           new ErrorResponse("Error", sendOTP.code!, [sendOTP.message])
//         );
//       }
//     }

//     res.status(200).json({
//       error: false,
//       errors: [],
//       data: {},
//       message: "Password reset OTP sent to your email",
//       status: 200,
//     });
//   }
// );

/**
 * @name resetPassword
 * @description Allows user change their password using the OTP
 * @route POST /auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword }: ResetPasswordDTO = req.body;

    if (!email || !newPassword) {
      return next(
        new ErrorResponse("Error", 400, [
          "Email, OTP, and new password are required",
        ])
      );
    }

    const passCheck = await userService.checkPassword(newPassword);
    if (!passCheck) {
      return next(
        new ErrorResponse("Error", 400, [
          "Password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number",
        ])
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new ErrorResponse("Error", 404, ["User not found"]));
    }

    await userService.encryptUserPassword(user, newPassword);

    const sendEmail = await emailService.otpEmail(
      user,
      email
    );
    if (sendEmail.error) {
      return next(
        new ErrorResponse("Error", sendEmail.code, [sendEmail.message])
      );
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {},
      message: "Password reset successfully",
      status: 200,
    });
  }
);




/**
 * @name verifyOTP
 * @description API endpoint to verify the a user OTP.
 * @route POST /auth/verify-otp
 * @access Public
 */
export const verifyEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, OTP }: verifyOtpDTO = req.body;

    if (!email || !OTP) {
      return next(
        new ErrorResponse("Error", 400, ["Email and reset code are required"])
      );
    }

    const otpVerification = await userService.verifyOTP(email, OTP.toString());
    if (otpVerification.error) {
      return next(
        new ErrorResponse("Error", otpVerification.code!, [
          otpVerification.message,
        ])
      );
    }

    return res.status(200).json({
      error: false,
      message: "OTP verified successfully",
      data: {},
      status: 200,
    });
  }
);

/**
 * @name resendOTP
 * @description API endpoint to resendOTP to a user.
 * @route POST /auth/resend-otp
 * @access Public
 */
// export const resendEmail = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email }: resendOtpDTO = req.body;

//     if (!email) {
//       return next(
//         new ErrorResponse("Error", 400, ["Email and reset code are required"])
//       );
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) {
//       return next(new ErrorResponse("Error", 400, ["user doesn't exist"]));
//     }

//     const OTP = await userService.generateOTPCode(user, OtpType.GENERIC);

//     if (OTP) {
//       const sendOTP = await otpService.sendOTPEmail({
//         driver: EmailDriver.SENDGRID,
//         user: user,
//         template: EmailTemplate.VERIFY_EMAIL,
//         code: OTP,
//         options: {
//           otpType: VerifyOTP.REGISTER,
//           salute: `${user.firstName}`,
//           bodyOne:
//             "Verify your troott account using the One-Time Password code below",
//         },
//       });

//       if (sendOTP.error) {
//         return next(
//           new ErrorResponse("Error", sendOTP.code!, [sendOTP.message])
//         );
//       }
//     }

//     return res.status(200).json({
//       error: false,
//       message: "OTP has been sent to your email!",
//       data: {},
//       status: 200,
//     });
//   }
// );



/**
 * @name getUser
 * @description Get the current logged-in user
 * @route GET /users/me
 * @access Private
 */
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = (req as any).user?.id;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, ["User not authenticated"]));
    }

    const user = await userRepository.findUser(userId);
    if (user.error || !user.data) {
      return next(new ErrorResponse("User not found", 404, []));
    }

    const {
      firstName,
      lastName,
      email,
      slug,
      userType,
      avatar,
      isSuper,
      isAdmin,
      isActive,
      isActivated,
      isDeactivated,
      lastLogin,
      _id,
    } = user.data;

    res.status(200).json({
      error: false,
      errors: [],
      data: {
        id: _id,
        firstName,
        lastName,
        email,
        slug,
        userType,
        avatar,
        isSuper,
        isAdmin,
        isActive,
        isActivated,
        isDeactivated,
        lastLogin,
      },
      message: "User profile retrieved",
      status: 200,
    });
  }
);

