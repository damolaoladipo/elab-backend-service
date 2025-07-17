import app from "./config/app.config";
import colors from "colors";
import connectDB from "./config/db.config";
import seedData from "./config/seeds/seeder.seed";
import agenda from "./services/jobs.service";

const connect = async () : Promise<void> => {

    await connectDB()
    await seedData()
    await agenda.start();

}

connect()


const PORT = process.env.PORT as string
 
const server = app.listen(PORT, () => {
    console.log(colors.bold.yellow (`eLab website server is running in ${process.env.NODE_ENV} mode`)) ;
})

process.on('unhandledRejection', (err:any, promise) => {
    console.log(colors.bold.red(`Error: ${err.message}`))
    server.close(() => process.exit(1))
})