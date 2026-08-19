import express from 'express';
import bcrypt from 'bcrypt';
import { getDB } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const user = req.body;
    const usersCollection = getDB().collection('users');

    const isExist = await usersCollection.findOne({email: user.email});
    if (isExist) {
        res.status(400).send({message: 'User already exists'});
        return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const userData = {
        email: user.email,
        password: hashedPassword,
        name: user.name,
    }

    const result = await usersCollection.insertOne(userData);
    res.send(result);
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    const usersCollection = getDB().collection('users');

    const user = await usersCollection.findOne({email: email});
    if (!user) {
        res.status(404).send({message: 'User not found'});
        return;
    }

    const isPossCorrect = await bcrypt.compare(password, user.password);
    if (!isPossCorrect) {
        res.status(401).send({message: 'Invalid password'});
        return;
    }

    res.send({ id: user._id, email: user.email });
});

export default router;