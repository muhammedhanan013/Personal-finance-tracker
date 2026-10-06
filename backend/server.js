const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(
    cors()
);

app.use(
    express.json()
);


// =========================
// MONGODB
// =========================

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "✅ MongoDB Connected"
        );

    })

    .catch((error) => {

        console.error(
            "❌ MongoDB Error:",
            error.message
        );

    });


// =========================
// ROUTES
// =========================

const authRoutes =
    require("./routes/auth");

const transactionRoutes =
    require("./routes/transactions");

const budgetRoutes =
    require("./routes/budget");

const savingsRoutes =
    require("./routes/savings");


app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/transactions",
    transactionRoutes
);

app.use(
    "/api/budget",
    budgetRoutes
);

app.use(
    "/api/savings",
    savingsRoutes
);


// =========================
// MONTHLY SUMMARY
// =========================

const Transaction =
    require("./models/Transaction");

const authMiddleware =
    require("./middleware/authMiddleware");


app.get(
    "/api/summary",
    authMiddleware,
    async (req, res) => {

        try {

            const now =
                new Date();

            const start =
                new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                );

            const end =
                new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    1
                );


            const transactions =
                await Transaction.find({

                    user:
                        req.userId,

                    date: {
                        $gte: start,
                        $lt: end
                    }

                });


            let income = 0;

            let expense = 0;


            const categories = {};


            transactions.forEach(
                transaction => {

                    if (
                        transaction.type ===
                        "income"
                    ) {

                        income +=
                            transaction.amount;

                    } else {

                        expense +=
                            transaction.amount;


                        const category =
                            transaction.category;

                        categories[category] =
                            (
                                categories[category]
                                || 0
                            ) +
                            transaction.amount;

                    }

                }
            );


            res.json({

                month:
                    now.getMonth() + 1,

                year:
                    now.getFullYear(),

                income,

                expense,

                balance:
                    income - expense,

                categories

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Unable to generate summary"
            });

        }

    }
);


// =========================
// HOME
// =========================

app.get(
    "/",
    (req, res) => {

        res.json({

            message:
                "Personal Finance Tracker API 🚀",

            status:
                "Running"

        });

    }
);


// =========================
// SERVER
// =========================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `🚀 Server running on http://localhost:${PORT}`
        );

    }
);