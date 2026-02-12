import { useState, useEffect } from "react";
import { useExpenses } from "../hooks/useExpenses";
import ExpenseModal from "../components/ExpenseModal";
import TransactionList from "../components/Transaction";
import "./Expenses.css";

export default function Expenses() {
  const {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    let filtered = [...expenses];

    if (category !== "all") {
      filtered = filtered.filter(t => t.category === category);
    }

    if (dateFrom) {
      filtered = filtered.filter(
        t => new Date(t.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(
        t => new Date(t.date) <= new Date(dateTo)
      );
    }

    setFilteredTransactions(filtered);
  }, [expenses, category, dateFrom, dateTo]);

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (txn) => {
    setEditingTransaction(txn);
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (data) => {
    try {
      if (editingTransaction) {
        await updateExpense(editingTransaction.id, data);
      } else {
        await addExpense(data);
      }

      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch {
      alert("Failed to save expense");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading expenses...</p>;
  }

  if (error) {
    return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  }

  return (
    <div className="expenses">
      <div className="expenses-header">
        <div>
          <h1 className="expenses-title">Expenses</h1>
          <p className="expenses-subtitle">
            Manage and track your expenses
          </p>
        </div>

        <button className="add-btn" onClick={openAddModal}>
          + Add Expense
        </button>
      </div>

      <div className="filters">
        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div>
          <label>To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <button
          className="clear-btn"
          onClick={() => {
            setCategory("all");
            setDateFrom("");
            setDateTo("");
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="expenses-card">
        <h3>
          Transactions ({filteredTransactions.length})
        </h3>

        {filteredTransactions.length === 0 ? (
          <p className="empty">No transactions found</p>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={openEditModal}
            onDelete={deleteExpense}
          />
        )}
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveExpense}
        transaction={editingTransaction}
      />
    </div>
  );
}
