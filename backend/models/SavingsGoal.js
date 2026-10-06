const mongoose = require("mongoose");

const savingsGoalSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            title: {
                type: String,
                required: true,
                trim: true
            },

            targetAmount: {
                type: Number,
                required: true,
                min: 1
            },

            savedAmount: {
                type: Number,
                default: 0,
                min: 0
            },

            deadline: {
                type: Date
            }
        },

        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "SavingsGoal",
        savingsGoalSchema
    );
    