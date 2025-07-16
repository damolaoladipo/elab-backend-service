import { Agenda } from "agenda";
import config from "./index";

const mongoUrl = config.DATABASE.replace("<password>", config.DATABASE_PASSWORD);

const agenda = new Agenda({
  db: { address: mongoUrl, collection: "jobs" },
  processEvery: "30 seconds",
});

export default agenda;