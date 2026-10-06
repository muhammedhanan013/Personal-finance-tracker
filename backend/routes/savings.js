const express = require("express");

const SavingsGoal =
    require("../models/SavingsGoal");

const authMiddleware =
    require("../middleware/authMiddleware");

const router =
    express.Router();


// =========================
// CREATE SAVINGS GOAL
// =========================

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                title,
                targetAmount,
                savedAmount,
                deadline
            } = req.body;

            if (
                !title ||
                !targetAmount
            ) {

                return res.status(400).json({
                    message:
                        "Title and target amount are required"
                });

            }

            const goal =
                await SavingsGoal.create({

                    user:
                        req.userId,

                    title,

                    targetAmount:
                        Number(targetAmount),

                    savedAmount:
                        Number(savedAmount || 0),

                    deadline:
                        deadline || null

                });

            res.status(201).json({

                message:
                    "Savings goal created",

                goal

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to create savings goal"
            });

        }

    }
);


// =========================
// GET SAVINGS GOALS
// =========================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const goals =
                await SavingsGoal.find({

                    user:
                        req.userId

                }).sort({
                    createdAt: -1
                });

            res.json(goals);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to fetch savings goals"
            });

        }

    }
);


// =========================
// UPDATE SAVINGS GOAL
// =========================

router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                title,
                targetAmount,
                savedAmount,
                deadline
            } = req.body;

            const goal =
                await SavingsGoal.findOneAndUpdate(

                    {
                        _id:
                            req.params.id,

                        user:
                            req.userId
                    },

                    {

                        title,

                        targetAmount:
                            Number(targetAmount),

                        savedAmount:
                            Number(savedAmount),

                        deadline:
                            deadline || null

                    },

                    {
                        new: true
                    }

                );

            if (!goal) {

                return res.status(404).json({
                    message:
                        "Savings goal not found"
                });

            }

            res.json({

                message:
                    "Savings goal updated",

                goal

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to update goal"
            });

        }

    }
);


// =========================
// DELETE SAVINGS GOAL
// =========================

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const goal =
                await SavingsGoal.findOneAndDelete({

                    _id:
                        req.params.id,

                    user:
                        req.userId

                });

            if (!goal) {

                return res.status(404).json({
                    message:
                        "Savings goal not found"
                });

            }

            res.json({

                message:
                    "Savings goal deleted"

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to delete goal"
            });

        }

    }
);


module.exports = router;