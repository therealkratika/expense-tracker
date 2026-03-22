import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses } from "../features/expenseSlice";
import { fetchBudget } from "../features/budgetSlice";
import ExpensePieChart from "../components/ExpensePieCharts";
import "./Dashboard.css";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { items: transactions, loading: expensesLoading } =
    useSelector((state) => state.expenses);

  const { amount: monthlyBudget, loading: budgetLoading } =
    useSelector((state) => state.budget);

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchBudget());
  }, [dispatch]);
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);

  const budgetNum = Number(monthlyBudget || 0);
  const available = budgetNum + totalIncome;
  const balance = available - totalExpenses;
  const budgetUsedPercent =
    available > 0
      ? Math.min((totalExpenses / available) * 100, 100)
      : 0;

  if (expensesLoading || budgetLoading)
    return <p className="loading">Updating data...</p>;

  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card balance">
          <h3>Total Balance</h3>
          <p>₹ {balance.toLocaleString()}</p>
        </div>

        <div className="card income">
          <h3>Transactional Income</h3>
          <p>₹ {totalIncome.toLocaleString()}</p>
        </div>

        <div className="card expense">
          <h3>Monthly Expenses</h3>
          <p>₹ {totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="budget-section">
        <h3>Budget Overview</h3>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${budgetUsedPercent}%`,
                backgroundColor:
                  budgetUsedPercent > 90 ? "#ff4d4d" : "#6366f1",
              }}
            ></div>
          </div>

          <p>
            {budgetUsedPercent.toFixed(1)}% of your ₹
            {available} money used
          </p>
        </div>
      </div>

      <div className="chart-container">
        <ExpensePieChart transactions={transactions} />
      </div>
    </div>
  );
}