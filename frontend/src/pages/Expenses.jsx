import { useEffect, useState } from "react";
import { ExpenseSDK } from "../api/sdk";
import ExpenseModal from "../components/ExpenseModal";
import TransactionList from "../components/Transaction";
import "./Expenses.css";

export default function Expenses() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await ExpenseSDK.getAll();
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to load expenses", err);
        alert("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);
  useEffect(() => {
    let filtered = [...transactions];

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
  }, [transactions, category, dateFrom, dateTo]);
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
      const res = await ExpenseSDK.update(editingTransaction.id, data);
      setTransactions(prev =>
        prev.map(t =>
          t.id === editingTransaction.id ? res.data : t
        )
      );
    } else {
      const res = await ExpenseSDK.create(data);
      setTransactions(prev => [res.data, ...prev]);
    }

    setIsModalOpen(false);
    setEditingTransaction(null);
  } catch (err) {
    console.error("Save failed", err);
    alert("Failed to save expense");
  }
};
  const deleteExpense = async (id) => {
    try {
      await ExpenseSDK.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete expense");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading expenses...</p>;
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
