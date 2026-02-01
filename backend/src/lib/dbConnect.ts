import { config } from "dotenv";
import mongoose from "mongoose";
config()

export const dbConnect  = async () : Promise<void> => {
    try {
        const db = await mongoose.connect(process.env.DB_URI || "")
        if(typeof(db.connection.readyState) === 'number')
            console.log("Connected to MongoDB")
        else
            console.log("Failed to connect to MongoDB")
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1)
    }
}