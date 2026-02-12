import { useEffect, useState } from "react";
import "./ExpenseModal.css";

const categories = ["Food", "Rent", "Transport", "Shopping", "Other"];

export default function ExpenseModal({ isOpen, onClose, onSave, transaction }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (transaction) {
      setAmount(Math.abs(transaction.amount).toString());
      setCategory(transaction.category);
      setDate(transaction.date);
      setDescription(transaction.description);
      setType(transaction.type);
    } else {
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setType("expense");
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return;

  try {
    setLoading(true);

    await onSave({
      amount: type === "expense" ? numAmount: -numAmount,
      category,
      date,
      description,
      type,
    });

    onClose(); // close modal after save
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{transaction ? "Edit Transaction" : "Add Expense"}</h2>
        <p className="subtitle">
          {transaction
            ? "Update transaction details"
            : "Enter details for your expense"}
        </p>

        <form onSubmit={handleSubmit}>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="actions">
            <button
              type="button"
              className="btn cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
            type="submit" 
            className="btn save"
            disabled={loading}>
              {loading ? (transaction ? "Updating..." : "Saving...") : transaction ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
