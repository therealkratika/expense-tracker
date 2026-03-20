import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../features/expenseSlice";
import ExpenseModal from "../components/ExpenseModal";
import TransactionList from "../components/Transaction";
import "./Expenses.css";

export default function Expenses() {
  const dispatch = useDispatch();

  const { items: expenses = [], loading, error } = useSelector(
    (state) => state.expenses
  );

  // Filter States
  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // ✅ SAFE FILTER LOGIC
  const filteredTransactions = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return [];

    let filtered = [...expenses];

    if (category !== "all") {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (t) => new Date(t.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(
        (t) => new Date(t.date) <= new Date(dateTo)
      );
    }

    return filtered;
  }, [expenses, category, dateFrom, dateTo]);

  // ✅ SAVE HANDLER
  const handleSaveExpense = async (data) => {
    try {
      if (editingTransaction) {
        await dispatch(
          updateExpense({ id: editingTransaction.id, data })
        ).unwrap();
      } else {
        await dispatch(addExpense(data)).unwrap();
      }

      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save expense");
    }
  };

  // ✅ DELETE HANDLER
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      dispatch(deleteExpense(id));
    }
  };

  // ✅ LOADING + ERROR STATES
  if (loading) return <p className="status-msg">Loading expenses...</p>;
  if (error) return <p className="status-msg error">{error}</p>;

  return (
    <div className="expenses">
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveExpense}
        transaction={editingTransaction}
      />

      <div className="expenses-card">
        <div className="expenses-header">
          <h3>Transactions ({filteredTransactions.length})</h3>
          <button
            className="primary-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Expense
          </button>
        </div>

        {/* FILTER UI */}
        <div className="filter-container">
          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
          </select>

          <div className="date-group">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        {/* TRANSACTION LIST */}
        {filteredTransactions.length === 0 ? (
          <p className="empty">No transactions found</p>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={(txn) => {
              setEditingTransaction(txn);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}