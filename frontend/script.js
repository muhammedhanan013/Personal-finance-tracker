const API_URL = "http://localhost:5000/api";


/* =========================
   SIGNUP
========================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name =
            document.getElementById("signupName").value;

        const email =
            document.getElementById("signupEmail").value;

        const password =
            document.getElementById("signupPassword").value;

        try {

            const response = await fetch(
                `${API_URL}/auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed");
                return;
            }

            alert("Account created successfully!");

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            alert(
                "Backend server is not running."
            );
        }

    });

}


/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message || "Invalid login"
                );

                return;
            }

            localStorage.setItem(
                "financeUser",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "token",
                data.token
            );

            window.location.href =
                "dashboard.html";

        } catch (error) {

            console.error(error);

            alert(
                "Backend server is not running."
            );
        }

    });

}


/* =========================
   DASHBOARD
========================= */

const user = JSON.parse(
    localStorage.getItem("financeUser")
);

if (
    window.location.pathname.includes(
        "dashboard.html"
    )
) {

    if (!user) {

        window.location.href =
            "login.html";

    } else {

        const userName =
            document.getElementById("userName");

        if (userName) {

            userName.innerText =
                `Hello, ${user.name} 👋`;

        }

        loadDashboard();

    }

}


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

    try {

        const token =
            localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/transactions`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        if (!response.ok) return;

        const transactions =
            await response.json();

        displayTransactions(transactions);

        calculateSummary(transactions);

    } catch (error) {

        console.log(
            "Waiting for backend..."
        );

    }

}


/* =========================
   DISPLAY TRANSACTIONS
========================= */

function displayTransactions(data) {

    const list =
        document.getElementById(
            "transactionList"
        );

    if (!list) return;

    if (!data || data.length === 0) {

        list.innerHTML =
            `<div class="empty-state">
                No transactions yet.
             </div>`;

        return;
    }

    list.innerHTML = data
        .slice(0, 10)
        .map(transaction => {

            const isIncome =
                transaction.type === "income";

            return `

                <div class="transaction-item">

                    <div class="transaction-info">

                        <div class="transaction-icon">
                            ${isIncome ? "📈" : "💸"}
                        </div>

                        <div>

                            <strong>
                                ${transaction.category}
                            </strong>

                            <br>

                            <small>
                                ${transaction.description || ""}
                            </small>

                        </div>

                    </div>

                    <div class="${
                        isIncome
                            ? "income-text"
                            : "expense-text"
                    }">

                        ${
                            isIncome
                                ? "+"
                                : "-"
                        }₹${transaction.amount}

                    </div>

                </div>
            `;

        })
        .join("");

}


/* =========================
   CALCULATE SUMMARY
========================= */

function calculateSummary(data) {

    let income = 0;

    let expense = 0;

    data.forEach(item => {

        if (item.type === "income") {

            income += Number(item.amount);

        } else {

            expense += Number(item.amount);

        }

    });

    const balance =
        income - expense;

    document.getElementById(
        "income"
    ).innerText =
        `₹${income.toLocaleString()}`;

    document.getElementById(
        "expense"
    ).innerText =
        `₹${expense.toLocaleString()}`;

    document.getElementById(
        "balance"
    ).innerText =
        `₹${balance.toLocaleString()}`;

    document.getElementById(
        "savings"
    ).innerText =
        `₹${balance.toLocaleString()}`;

    generateAISuggestion(
        income,
        expense
    );

}


/* =========================
   ADD TRANSACTION
========================= */

const transactionForm =
    document.getElementById(
        "transactionForm"
    );

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const type =
                document.getElementById(
                    "transactionType"
                ).value;

            const amount =
                document.getElementById(
                    "transactionAmount"
                ).value;

            const category =
                document.getElementById(
                    "transactionCategory"
                ).value;

            const description =
                document.getElementById(
                    "transactionDescription"
                ).value;

            const date =
                document.getElementById(
                    "transactionDate"
                ).value;

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await fetch(
                        `${API_URL}/transactions`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({

                                type,
                                amount,
                                category,
                                description,
                                date

                            })

                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to add transaction"
                    );

                    return;
                }

                alert(
                    "Transaction added successfully!"
                );

                transactionForm.reset();

                loadDashboard();

            } catch (error) {

                console.error(error);

                alert(
                    "Backend server is not running."
                );

            }

        }
    );

}


/* =========================
   AI SUGGESTION
========================= */

function generateAISuggestion(
    income,
    expense
) {

    const suggestion =
        document.getElementById(
            "aiSuggestion"
        );

    if (!suggestion) return;

    if (income === 0) {

        suggestion.innerText =
            "Add your income and expenses to receive AI financial suggestions.";

        return;
    }

    const percentage =
        (expense / income) * 100;

    if (percentage > 80) {

        suggestion.innerText =
            "⚠️ You are spending more than 80% of your income. Try reducing unnecessary expenses.";

    } else if (percentage > 60) {

        suggestion.innerText =
            "💡 Your expenses are getting high. Consider setting a monthly budget.";

    } else {

        suggestion.innerText =
            "🎉 Great job! Your spending is under control. Keep saving regularly.";

    }

}


/* =========================
   QUICK ACTIONS
========================= */

function openTransactionForm(type) {

    const section =
        document.getElementById(
            "transactions"
        );

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

    const select =
        document.getElementById(
            "transactionType"
        );

    if (select) {

        select.value = type;

    }

}


function openBudgetForm() {

    document.getElementById(
        "budget"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


function openSavingsForm() {

    document.getElementById(
        "savings"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   LOGOUT
========================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "financeUser"
            );

            localStorage.removeItem(
                "token"
            );

            window.location.href =
                "login.html";

        }
    );

}
// INITIAL LOAD

loadDashboard();
loadTransactions();
loadBudget();
loadSavingsGoals();
getAISuggestions();