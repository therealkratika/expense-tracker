import { useEffect, useState } from "react";
import { BudgetSDK,ExpenseSDK } from "../api/sdk";
import { useBudget } from "../hooks/useBudget";
import "./Budget.css";

export default function Budget() {
  const  { budget, updateBudget } = useBudget();
  const [budgetInput, setBudgetInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const exp = await ExpenseSDK.getAll();
      setExpenses(exp);
    };

    loadData();
  }, []);

  const totalExpenses = expenses
    .filter(e => e.type === "expense")
    .reduce((sum, e) => sum + Math.abs(e.amount), 0);

  const budgetUsed =
    budget === 0 ? 0 : (totalExpenses / budget) * 100;

  const remaining = budget - totalExpenses;

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  const daysRemaining = daysInMonth - new Date().getDate();
  const dailyBudget =
    remaining > 0 && daysRemaining > 0
      ? remaining / daysRemaining
      : 0;

  const saveBudget = async () => {
    const value = parseFloat(budgetInput);
    if (isNaN(value) || value <= 0) return;

    await updateBudget(value);
    setEditing(false);
  };

  return (
    <div className="budget">
      <h1>Budget Management</h1>
      <p className="subtitle">Track and control your spending</p>
      <div className="card">
        <h3>Monthly Budget</h3>

        {editing ? (
          <>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <div className="row">
              <button onClick={saveBudget}>Save</button>
              <button className="secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="big">₹ {monthlyBudget}</p>
            <button className="secondary" onClick={() => setEditing(true)}>
              Update Budget
            </button>
          </>
        )}
      </div>
      <div className="card">
        <h3>Budget Status</h3>

        <div className="progress">
          <div
            className={`progress-fill ${
              budgetUsed > 90 ? "danger" : "good"
            }`}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
        </div>

        <p>{budgetUsed.toFixed(1)}% used</p>

        <div className="grid">
          <div>
            <span>Spent</span>
            <strong className="red">₹ {totalExpenses}</strong>
          </div>
          <div>
            <span>Remaining</span>
            <strong className={remaining < 0 ? "red" : "green"}>
              ₹ {remaining}
            </strong>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Daily Budget</h3>
        <p className="big">₹ {dailyBudget.toFixed(2)}</p>
        <p className="muted">
          for next {daysRemaining} days
        </p>
      </div>
    </div>
  );
}
