import { useEffect, useState } from "react";
import { BudgetSDK } from "../api/sdk";

export function useBudget() {
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBudget = async () => {
    setLoading(true)
    try {
      const data = await BudgetSDK.getBudget();
      setBudget(data?.amount || 0);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (amount) => {
    const updated = await BudgetSDK.updateBudget(amount);
    setBudget(updated.amount);
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  return { budget, updateBudget };
}
