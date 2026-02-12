import "./Transaction.css";

export default function TransactionList({
  transactions,
  showActions = true,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="txn-list">
      {transactions.map((txn) => {
        const isIncome = txn.type === "income";

        return (
          <div key={txn.id} className="txn-item">
            <div className="txn-left">
              <div
                className={`txn-icon ${
                  isIncome ? "income" : "expense"
                }`}
              >
              </div>

              <div className="txn-info">
                <p className="txn-title">{txn.description}</p>
                <span className="txn-meta">
                  {txn.category} • {formatDate(txn.date)}
                </span>
              </div>
            </div>

            <div className="txn-right">
              <span
                className={`txn-amount ${
                  isIncome ? "income" : "expense"
                }`}
              >
                {isIncome ? "+" : "-"}₹{Math.abs(txn.amount)}
              </span>

              {showActions && (
                <div className="txn-actions">
                  <button
                    className="edit-btn"
                    onClick={() => onEdit && onEdit(txn)}
                  >
                    edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete && onDelete(txn.id)}
                  >
                    delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
