import express from "express";
import jwt from 'jsonwebtoken';
import { User } from '../models/users.model.js'
import { Transactions } from "../models/transaction.model.js";
import userMiddleware from "../middleware/user.middleware.js";
const router = express.Router();

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username });
    if (user) {
        return res.json({
            msg: "user already exsists"
        })
    }
    try {
        const balance = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
        const newUser = await User.create({
            username,
            password,
            balance
        })

        const payload = {
            username: newUser.username,
            id: newUser._id,
            balance : newUser.balance
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.json({
            msg: "user created successfully",
            token
        })

    } catch (error) {
        res.json({
            error: error.message,
            msg: " failed to create an account"
        })
    }

})

router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username, password });
    if (!user) {
        return res.json({
            msg: "user is not in our database exsists"
        })
    }
    try {
        if (user) {
            const payload = {
                username: user.username,
                id: user._id,
                balance : user.balance
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({ token });
        }

    } catch (error) {
        res.json({
            error: error.message,
            msg: " failed to signin into account"
        })
    }
})

//                                     transaction route 

router.post('/transactions', userMiddleware, async (req, res) => {
    const senderId = req.userId;
    //console.log(senderId);
    const { receiverUsername, amount, description } = req.body;
    const newAmount = parseFloat(amount);
    try {
        const receiver = await User.findOne({ username: receiverUsername });
        if (!receiver) {
            return res.status(404).json({ msg: "Receiver does not exist on PayFree" });
        }


        const sender = await User.findById(senderId);
        if (sender.balance < amount) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }


        const transaction = await Transactions.create({
            sender: senderId,
            receiver: receiver._id,
            amount,
            description
        });


        sender.balance -= newAmount;
        receiver.balance += newAmount;


        await sender.save();
        await receiver.save();

        res.json({
            msg: "Transaction completed successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            msg: "Failed to process transaction",
            error: error.message
        });
    }
});

router.post('/searchUser', async (req, res) => {
    const username = req.body.username;
    const user = await User.findOne({ username });
   
    if(user == null){
        res.json({
            msg:"user are not avialable"
        })
    }else{

    const data = {
        username: user.username,
        userId: user._id,
        balance: user.balance
    }
    if (user) {
        res.json({
            data
        })
    } else {
        res.json({
            msg: "user are not available"
        })
    }
}
})

router.get('/history',userMiddleware, async(req,res) => {
    const senderId = req.userId;
    const transaction = await Transactions.find({});
    res.json({
        transaction
    })
});


router.get('/users', async (req,res) => {
        const user = await User.find({});
        res.json({
            user: user
        });
});

export default router;
