import mongoose from 'mongoose'
import { dbConfig } from '../../config/db.config'


export const initializeMongoose = () => {
    // Set up default mongoose connection
    var mongoDB = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/?authSource=admin`;
    mongoose.connect(mongoDB);

    //Get the default connection
    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
        console.log("Connected successfully");
    });
}
