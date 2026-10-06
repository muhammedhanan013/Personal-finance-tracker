import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression


def analyze_finances(transactions):

    if not transactions:

        return {
            "status": "no_data",
            "message": "Add some transactions to get AI suggestions."
        }


    # Convert transactions to DataFrame

    df = pd.DataFrame(transactions)


    # Make sure amount is numeric

    df["amount"] = pd.to_numeric(
        df["amount"],
        errors="coerce"
    )


    df = df.dropna(
        subset=["amount"]
    )


    # Separate income and expenses

    income_df = df[
        df["type"] == "income"
    ]

    expense_df = df[
        df["type"] == "expense"
    ]


    total_income = float(
        income_df["amount"].sum()
    )

    total_expense = float(
        expense_df["amount"].sum()
    )


    balance = (
        total_income -
        total_expense
    )


    # ==================================
    # EXPENSE CATEGORIES
    # ==================================

    category_spending = {}

    if not expense_df.empty:

        category_spending = (
            expense_df
            .groupby("category")["amount"]
            .sum()
            .to_dict()
        )


    # ==================================
    # TOP SPENDING CATEGORY
    # ==================================

    top_category = None
    top_category_amount = 0

    if category_spending:

        top_category = max(
            category_spending,
            key=category_spending.get
        )

        top_category_amount = float(
            category_spending[
                top_category
            ]
        )


    # ==================================
    # SPENDING PERCENTAGE
    # ==================================

    if total_income > 0:

        spending_percentage = (
            total_expense /
            total_income
        ) * 100

    else:

        spending_percentage = 0


    # ==================================
    # AI SUGGESTIONS
    # ==================================

    suggestions = []


    if total_income == 0:

        suggestions.append(
            "💡 Add your income to get better financial recommendations."
        )


    if total_expense == 0:

        suggestions.append(
            "🎉 You haven't recorded any expenses yet."
        )


    if spending_percentage > 90:

        suggestions.append(
            "🚨 Critical: You are spending more than 90% of your income. Try reducing unnecessary expenses."
        )

    elif spending_percentage > 80:

        suggestions.append(
            "⚠️ You are spending more than 80% of your income. Consider reducing non-essential expenses."
        )

    elif spending_percentage > 60:

        suggestions.append(
            "💡 Your expenses are above 60% of your income. Consider setting a stricter monthly budget."
        )

    else:

        suggestions.append(
            "🎉 Your overall spending is currently under control."
        )


    # ==================================
    # CATEGORY ANALYSIS
    # ==================================

    if top_category:

        if (
            total_expense > 0 and
            top_category_amount >
            total_expense * 0.30
        ):

            suggestions.append(
                f"🍔 You are spending heavily on {top_category}. Consider reducing this category."
            )


    # ==================================
    # SAVINGS SUGGESTION
    # ==================================

    if balance > 0:

        suggested_saving = (
            balance * 0.20
        )

        suggestions.append(
            f"💰 Consider saving around ₹{suggested_saving:.0f} from your current balance."
        )

    elif balance < 0:

        suggestions.append(
            "🚨 Your expenses are higher than your income. Focus on reducing unnecessary spending."
        )


    # ==================================
    # SIMPLE ML PREDICTION
    # ==================================

    prediction = None


    if not expense_df.empty:

        daily_expenses = (
            expense_df
            .groupby("date")["amount"]
            .sum()
            .reset_index()
        )


        if len(daily_expenses) >= 3:

            daily_expenses[
                "day"
            ] = np.arange(
                len(daily_expenses)
            )


            X = daily_expenses[
                ["day"]
            ]

            y = daily_expenses[
                "amount"
            ]


            model = LinearRegression()

            model.fit(X, y)


            next_day = np.array(
                [[len(daily_expenses)]]
            )


            prediction = float(
                model.predict(
                    next_day
                )[0]
            )


    return {

        "status": "success",

        "summary": {

            "total_income":
                total_income,

            "total_expense":
                total_expense,

            "balance":
                balance,

            "spending_percentage":
                round(
                    spending_percentage,
                    2
                )

        },

        "top_category": {

            "name":
                top_category,

            "amount":
                top_category_amount

        },

        "category_spending":
            category_spending,

        "suggestions":
            suggestions,

        "predicted_next_expense":
            round(
                prediction,
                2
            )
            if prediction is not None
            else None

    }