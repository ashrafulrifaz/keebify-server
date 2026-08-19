import express from 'express';

const router = express.Router();

router.get('/products', async (req, res) => {
    const result = await productsCollection.find().toArray()
    res.send(result)
})

router.post('/products', async (req, res) => {
    const product = req.body;
    console.log(product);
    const result = await productsCollection.insertOne(product);
    res.send(result)
})

export default router;