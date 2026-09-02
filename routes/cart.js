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

    console.log(item)

    if (!userEmail || !item[0].productIds || item[0].productIds.length === 0) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const existingCart = await cartCollection.findOne({ userEmail });

    if (!existingCart) {
        await cartCollection.insertOne({
            userEmail,
            items: [{ productIds: item[0].productIds, quantity: item[0].productQuantity}],
            createdAt: new Date(),
        });
        return res.json({ message: 'Cart created and item added' });
    }

    const alreadyInCart = existingCart.items.some((cartItem) => item[0].productIds.includes(cartItem.productIds[0]));

    if (alreadyInCart) {
        return res.status(409).json({ message: 'Product already in cart' });
    }

    await cartCollection.updateOne(
        { userEmail },
        { $push: { items: { productIds: item[0].productIds, quantity: item[0].productQuantity} } }
    );

    res.json({ message: 'Added to cart' });
});

router.delete('/', async (req, res) => {
    const { userEmail, productId } = req.body;
    const cartCollection = getDB().collection('cart');
    await cartCollection.updateOne(
        { userEmail },
        { $pull: { items: { productIds: productId } } }
    );
    res.json({ message: 'Removed from cart' });
});

export default router;