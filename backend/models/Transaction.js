const mongoose = require("mongoose");

const transactionSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            type: {
                type: String,
                enum: ["income", "expense"],
                required: true
            },

            amount: {
                type: Number,
                required: true,
                min: 1
            },

            category: {
                type: String,
                required: true,
                trim: true
            },

            description: {
                type: String,
                default: ""
            },

            date: {
                type: Date,
                required: true
            }
        },

        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Transaction",
        transactionSchema
    );