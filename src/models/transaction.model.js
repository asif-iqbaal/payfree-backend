import mongoose, { Schema } from "mongoose";

const transactions = new Schema({
     sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     receiver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     amount: {
          type: Number,
          required: true
     },
     description: { type: String },
     date: {
          type: Date,
          default: Date.now
     }
})

export const Transactions = mongoose.model("Transaction", transactions);