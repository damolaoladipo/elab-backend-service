import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";;
import userService from "../services/user.service";
import  NewsletterRepository  from "../repositories/newsletter.repository";
import emailJobSchedular from "../jobs/scheduler/email.scheduler";
import { EmailDriver } from "../utils/enums.util";
import { DateTime } from "luxon";

/**
 * @name subscribeToNewsletter
 * @description Subscribes a user to the newsletter
 * @route POST /newsletter/subscribe
 * @access Public
 */
export const subscribeToNewsletter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!userService.checkEmail(email)) {
      return next(new ErrorResponse("Invalid email format.", 400, []));
    }

    const existingSubscriber = await NewsletterRepository.findOne(email.toLowerCase());
    if (existingSubscriber.error) {
      return next(
        new ErrorResponse(existingSubscriber.message, existingSubscriber.code, [])
      );
    }

    const subscriber =await NewsletterRepository.create(email.toLowerCase());
    if (subscriber.error) {
      return next(
        new ErrorResponse(subscriber.message, subscriber.code, [])
      );
    }

    // Optionally send welcome email
    await emailJobSchedular.sendNewsletterWelcomeEmail({
      user: {
        email: subscriber.data.email,
        name: subscriber.data.email.split("@")[0],
      },
      template: "newsletter-welcome",
      subject: "Welcome to our newsletter!",
      driver: EmailDriver.MAILTRAP,
      payload: {
        date: DateTime.now().toFormat("dd/MM/yyyy HH:mm"),
      },
    });

    res.status(201).json({
      error: false,
      errors: [],
      data: {},
      message: "You have successfully subscribed to our newsletter.",
      status: 201,
    });
  }
);
