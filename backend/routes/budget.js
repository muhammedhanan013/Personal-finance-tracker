const express = require("express");

const Budget =
    require("../models/Budget");

const authMiddleware =
    require("../middleware/authMiddleware");

const router =
    express.Router();


// =========================
// SET / UPDATE BUDGET
// =========================

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                amount,
                month,
                year
            } = req.body;

            if (
                !amount ||
                !month ||
                !year
            ) {

                return res.status(400).json({
                    message:
                        "Amount, month and year are required"
                });

            }

            const budget =
                await Budget.findOneAndUpdate(

                    {
                        user:
                            req.userId,

                        month:
                            Number(month),

                        year:
                            Number(year)
                    },

                    {
                        amount:
                            Number(amount)
                    },

                    {
                        new: true,
                        upsert: true
                    }

                );

            res.json({

                message:
                    "Budget saved successfully",

                budget

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to save budget"
            });

        }

    }
);


// =========================
// GET CURRENT MONTH BUDGET
// =========================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const now =
                new Date();

            const month =
                now.getMonth() + 1;

            const year =
                now.getFullYear();

            const budget =
                await Budget.findOne({

                    user:
                        req.userId,

                    month,

                    year

                });

            res.json(
                budget || {
                    amount: 0,
                    month,
                    year
                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to fetch budget"
            });

        }

    }
);


// =========================
// DELETE BUDGET
// =========================

router.delete(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const now =
                new Date();

            await Budget.findOneAndDelete({

                user:
                    req.userId,

                month:
                    now.getMonth() + 1,

                year:
                    now.getFullYear()

            });

            res.json({

                message:
                    "Budget deleted successfully"

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to delete budget"
            });

        }

    }
);


module.exports = router;