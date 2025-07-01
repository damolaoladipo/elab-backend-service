import { config } from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { ENVType } from "../utils/enums.util";
import ENV from "../utils/env.util";
import errorHandler from "../middlewares/error.mdw";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import expressSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import v1Routes from "../routes/v1/routes.router";
import winston from "winston";

config();

const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

app.use(bodyParser.json({ limit: "50mb", inflate: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

// cookie parser
app.use(cookieParser());

app.use(expressSanitize());

// secure response header
app.use(helmet());

// prevent parameter pollution
app.use(hpp());

// enable CORS: communicate with multiple domain
app.use(cors({ origin: true, credentials: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); 


const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  
    let enviornemnt = ENVType.DEVELOPMENT;

  if (ENV.isProduction()) {
    enviornemnt = ENVType.PRODUCTION;
  } else if (ENV.isStaging()) {
    enviornemnt = ENVType.STAGING;
  } else if (ENV.isDevelopment()) {
    enviornemnt = ENVType.DEVELOPMENT;
  }

  logger.info("Request received at /");

  res.status(200).render("health-check", {
    error: false,
    errors: [],
    data: {
      name: "eLab Website API",
      version: "1.0.0",
    },
    message: `eLab website api v1.0.0 is running on ${enviornemnt} mode`,
    status: 200,
  });

  logger.info("Response sent from /");
});

app.use("/v1", v1Routes);

app.use(errorHandler);

export default app;
