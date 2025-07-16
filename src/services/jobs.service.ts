import { Agenda } from "agenda";
import { getMongoURI } from "../utils/helper.util";


const agenda = new Agenda({
  db: { address: getMongoURI(), collection: "jobs" },
  processEvery: "30 seconds",
});

export default agenda;