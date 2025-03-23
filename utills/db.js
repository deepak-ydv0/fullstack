import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();


const  db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected mongodb");
    })
    .catch((e) => console.log(e, "Faild to connect DB"));
}

export default db