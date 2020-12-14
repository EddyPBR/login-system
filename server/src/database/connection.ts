import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(
  `mongodb://${process.env.DB_HOST}/${process.env.DB_PORT}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  },
  (error) =>
    error ? console.error(error.message) : console.warn("DATABASE CONNECTED")
);

mongoose.set("useCreateIndex", true);

export default mongoose;
