import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const {email} = req.query
    const cartCollection = getDB().collection('cart');
    const result = await cartCollection.find({userEmail: email}).toArray()
    res.send(result)
})

router.post('/', async (req, res) => {
    const { userEmail, item } = req.body;
    const cartCollection = getDB().collection('cart');

    if (!userEmail || !item[0].productIds || item[0].productIds.length === 0) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const existingCart = await cartCollection.findOne({ userEmail });

    if (!existingCart) {
        await cartCollection.insertOne({
            userEmail,
            items: [{ productIds: item[0].productIds, quantity: item[0].quantity || 1 }],
            createdAt: new Date(),
        });
        return res.json({ message: 'Cart created and item added' });
    }

    const alreadyInCart = existingCart.items.some((cartItem) => item[0].productIds.includes(cartItem.productIds[0]));

    if (alreadyInCart) {
        return res.status(200).json({ message: 'Product already in cart' });
    }

    await cartCollection.updateOne(
        { userEmail },
        { $push: { items: { productIds: item[0].productIds, quantity: item[0].quantity || 1 } } }
    );

    res.json({ message: 'Added to cart' });
});

export default router;