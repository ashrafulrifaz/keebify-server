import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3001 || process.env.PORT;

app.use(express.json());

const client = new MongoClient(`mongodb+srv://keebify:fBMbZ7iLe2npovek@cluster0.klq4o7m.mongodb.net/?appName=Cluster0`);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");

        const productsCollection = client.db('keebify').collection('products');

        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })
        
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productsCollection.insertOne(product);
            res.send(result)
        })

        return client;
    } catch (err) {
        console.dir(err);
    }
}

export async function disconnectFromMongoDB() {
    await client.close();
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

connectToMongoDB()