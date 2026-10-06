const express = require("express");

const Transaction =
    require("../models/Transaction");

const authMiddleware =
    require("../middleware/authMiddleware");

const router =
    express.Router();


// =========================
// ADD TRANSACTION
// =========================

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                type,
                amount,
                category,
                description,
                date
            } = req.body;


            if (
                !type ||
                !amount ||
                !category ||
                !date
            ) {

                return res.status(400).json({
                    message:
                        "Please fill all required fields"
                });

            }


            if (
                !["income", "expense"]
                    .includes(type)
            ) {

                return res.status(400).json({
                    message:
                        "Invalid transaction type"
                });

            }


            const transaction =
                await Transaction.create({

                    user:
                        req.userId,

                    type,

                    amount:
                        Number(amount),

                    category,

                    description:
                        description || "",

                    date

                });


            res.status(201).json({

                message:
                    "Transaction added successfully",

                transaction

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to add transaction"
            });

        }

    }
);


// =========================
// GET TRANSACTIONS
// =========================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const transactions =
                await Transaction.find({

                    user:
                        req.userId

                }).sort({
                    date: -1
                });


            res.json(
                transactions
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to fetch transactions"
            });

        }

    }
);


// =========================
// DELETE TRANSACTION
// =========================

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const transaction =
                await Transaction.findOneAndDelete({

                    _id:
                        req.params.id,

                    user:
                        req.userId

                });


            if (!transaction) {

                return res.status(404).json({
                    message:
                        "Transaction not found"
                });

            }


            res.json({

                message:
                    "Transaction deleted successfully"

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to delete transaction"
            });

        }

    }
);


module.exports = router;