import { Agenda } from "agenda";
import { getMongoURI } from "../utils/helper.util";
import emailDefinitions from "../jobs/definitions/email.definition";


const agenda = new Agenda({
  db: { address: getMongoURI(), collection: "jobs" },
  processEvery: "30 seconds",
    maxConcurrency: 20,
  defaultConcurrency: 5,
  defaultLockLifetime: 10000,
});

agenda.on("fail", async (err, job) => {
  console.error(`Job failed: ${job.attrs.name}`, err.message);
  const maxRetries = 3;
  const attempts = job.attrs.failCount || 0;

  if (attempts < maxRetries) {
    const delay = Math.pow(2, attempts) * 1000;
    await agenda.schedule(new Date(Date.now() + delay), job.attrs.name!, job.attrs.data);
  }
});

emailDefinitions(agenda)

export default agenda;