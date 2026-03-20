import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} from "../features/expenseSlice";
import ExpenseModal from "../components/ExpenseModal";
import TransactionList from "../components/Transaction";
import "./Expenses.css";

export default function Expenses() {
  const dispatch = useDispatch();
  
  const { items: expenses, loading, error } = useSelector((state) => state.expenses);

  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...expenses];
    if (category !== "all") filtered = filtered.filter(t => t.category === category);
    if (dateFrom) filtered = filtered.filter(t => new Date(t.date) >= new Date(dateFrom));
    if (dateTo) filtered = filtered.filter(t => new Date(t.date) <= new Date(dateTo));
    return filtered;
  }, [expenses, category, dateFrom, dateTo]);

  const handleSaveExpense = async (data) => {
    try {
      if (editingTransaction) {
        await dispatch(updateExpense({ id: editingTransaction.id, data })).unwrap();
      } else {
        await dispatch(addExpense(data)).unwrap();
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch {
      alert("Failed to save expense");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      dispatch(deleteExpense(id));
    }
  };

  if (loading) return <p style={{ padding: "30px" }}>Loading expenses...</p>;
  if (error) return <p style={{ padding: "30px", color: "red" }}>{error}</p>;

  return (
    <div className="expenses">
      
      <div className="expenses-card">
        <h3>Transactions ({filteredTransactions.length})</h3>
        {filteredTransactions.length === 0 ? (
          <p className="empty">No transactions found</p>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={(txn) => { setEditingTransaction(txn); setIsModalOpen(true); }}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        onSave={handleSaveExpense}
        transaction={editingTransaction}
      />
    </div>
  );
}