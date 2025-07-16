import Agenda from "agenda";
import { ENVType } from "../utils/enums.util";

let agenda: Agenda;

export const initAgenda = async () => {
  let mongoURI: string | undefined;

  const env = process.env.NODE_ENV as ENVType;

  switch (env) {
    case ENVType.PRODUCTION:
      mongoURI = process.env.MONGODB_URI;
      break;
    case ENVType.STAGING:
      mongoURI = process.env.MONGODB_STAGING_URI;
      break;
    case ENVType.DEVELOPMENT:
    default:
      mongoURI = process.env.MONGODB_LOCAL_URI;
      break;
  }

  if (!mongoURI) {
    throw new Error("Agenda: MongoDB URI is missing for current environment.");
  }

  agenda = new Agenda({
    db: { address: mongoURI, collection: "jobs" },
    processEvery: "30 seconds",
    maxConcurrency: 20,
  });

  // Optionally log
  agenda.on("ready", () => {
    console.log("Agenda is ready and connected to MongoDB");
  });

  agenda.on("error", (err) => {
    console.error("Agenda connection error:", err);
  });

  return agenda;
};

export const getAgenda = () => agenda;
