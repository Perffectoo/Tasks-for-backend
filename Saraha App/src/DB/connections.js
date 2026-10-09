import mongoose from "mongoose";
import { DB_URI } from "../../Config/config.service.js";
const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
        });

        await mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;