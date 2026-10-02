import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGO_URI);

export const db=client.db("BooksDB");

export const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
 }