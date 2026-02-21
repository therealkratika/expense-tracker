
import { useEffect, useState } from "react";
import { ExpenseSDK } from "../api/sdk";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await ExpenseSDK.getAll();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense) => {
    const created = await ExpenseSDK.create(expense);
    setExpenses(prev => [created, ...prev]);
  };

  const updateExpense = async (id, expense) => {
    const updated = await ExpenseSDK.update(id, expense);
    setExpenses(prev =>
      prev.map(e => (e.id === id ? updated : e))
    );
  };

  const deleteExpense = async (id) => {
    await ExpenseSDK.delete(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
