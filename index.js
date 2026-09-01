import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { connectToMongoDB } from './db.js';
import ProductsRouter from './routes/products.js';
import AuthRouter from './routes/auth.js';
import CartRouter from './routes/cart.js';

const app = express();
const port = 3001 || process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/products', ProductsRouter);
app.use('/auth', AuthRouter);
app.use('/cart', CartRouter);

connectToMongoDB().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
})