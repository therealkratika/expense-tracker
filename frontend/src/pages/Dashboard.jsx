import { useEffect, useState } from "react";
import { ExpenseSDK,BudgetSDK } from "../api/sdk.js";
import "./Dashboard.css";
import ExpensePieChart from "../components/ExpensePieCharts";
export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [expensesRes, budgetRes] = await Promise.all([
          ExpenseSDK.getAll(),
          BudgetSDK.getBudget()
        ]);
        setTransactions(expensesRes);
        setMonthlyBudget(budgetRes?.amount|| 0);
      } catch (err) {
        console.error("Dashboard load failed", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading dashboard...</p>;
  }

  if (error) {
    return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  }
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalBudget = Number(totalIncome) + Number(monthlyBudget);
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalBudget - totalExpenses;

  const budgetUsed =
    monthlyBudget > 0
      ? Math.min((totalExpenses / monthlyBudget) * 100, 100)
      : 0;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="cards">
        <div className="card balance">
          <h3>Total Balance</h3>
          <p>₹ {balance}</p>
        </div>

        <div className="card income">
          <h3>transactional Income</h3>
          <p>₹ {totalIncome}</p>
        </div>

        <div className="card expense">
          <h3>Monthly Expenses</h3>
          <p>₹ {totalExpenses}</p>
        </div>
      </div>
      <div className="budget-card">
        <h3>Budget Overview</h3>

        {monthlyBudget > 0 ? (
          <>
            <p>
              ₹ {totalExpenses} used of ₹ {monthlyBudget}
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${budgetUsed}%` }}
              />
            </div>

            <p className="budget-text">
              {budgetUsed.toFixed(1)}% used
            </p>
          </>
        ) : (
          <p className="budget-text">
            No budget set yet. Go to Budget page.
          </p>
        )}
      </div>
      <div className="chart-section">
  <h3>Spending by Category</h3>
  <ExpensePieChart transactions={transactions} />
</div>
      <div className="transactions">
        <h3>Recent Transactions</h3>

        {transactions.length === 0 ? (
          <p className="empty">No transactions yet</p>
        ) : (
          <ul>
            {transactions.slice(0, 5).map(txn => (
              <li key={txn.id} className={txn.type}>
                <span>{txn.category}</span>
                <span>
                  {txn.type === "expense" ? "-" : "+"}₹
                  {Math.abs(txn.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
