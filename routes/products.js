import { getDB } from '../db.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    const productsCollection = getDB().collection('products');
    const result = await productsCollection.find().toArray()
    res.send(result)
})

router.post('/', async (req, res) => {
    const product = req.body;
    const productsCollection = getDB().collection('products');
    const result = await productsCollection.insertOne(product);
    res.send(result)
})

export default router;