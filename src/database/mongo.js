import mongo from "mongoose";
import 'dotenv/config';

const { DATABASE_URL } = process.env

export default (async () => {
  mongo.set("strictQuery", false)
  await mongo.connect(DATABASE_URL)
  .then(() => {
    console.log('Database connected!')
    })
  .catch(console.error)
})();
