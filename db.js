import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

const client = new MongoClient(`mongodb+srv://keebify:fBMbZ7iLe2npovek@cluster0.klq4o7m.mongodb.net/?appName=Cluster0`);

let db;

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        db = client.db('keebify');
        return db;
    } catch (err) {
        console.dir(err);
    }
}

export function getDB() {
    return db;
}

export async function disconnectFromMongoDB() {
    await client.close();
}