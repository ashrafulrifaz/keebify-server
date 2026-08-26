import { ObjectId } from 'mongodb';
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

router.patch('/:id', async (req, res) => {
    const productsCollection = getDB().collection('products');
    const {id} = req.params
    const {status} = req.body
    const filter = {_id: new ObjectId(id)}
    const newStatus = {
        $set: {
            status: status
        }
    }
    const result = await productsCollection.updateOne(filter, newStatus)
    res.send(result)
})

router.delete('/:id', async (req, res) => {
    const productsCollection = getDB().collection('products');
    const {id} = req.params
    const filter = {_id: new ObjectId(id)}
    const result = await productsCollection.deleteOne(filter)
    res.send(result)
})

export default router;