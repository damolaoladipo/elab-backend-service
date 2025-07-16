import mongoose, { ConnectOptions } from "mongoose";
import { ENVType } from "../utils/enums.util";
import colors from "colors";
import { getMongoURI } from "../utils/helper.util";

const options: ConnectOptions = {
  autoIndex: true,
  maxIdleTimeMS: 1000,
  wtimeoutMS: 6000,
  connectTimeoutMS: 6000,
  socketTimeoutMS: 6000,
  serverSelectionTimeoutMS: 6000,
  family: 4,
};

const connectDB = async () => {
  let dataBaseURI = getMongoURI();

  try {
    const dbConn = await mongoose.connect(dataBaseURI, options);

    console.log(
      colors.cyan.bold.underline(
        `eLab website ${process.env.NODE_ENV?.toUpperCase()} database connected: ${
          dbConn.connection.host
        }`
      )
    );
  } catch (error) {
    console.log(
      colors.cyan.bold.underline(
        `Could not connect to eLab website database: ${error}`
      )
    );
    process.exit(1);
  }
};

export default connectDB;
