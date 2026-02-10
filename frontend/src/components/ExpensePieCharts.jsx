import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ExpensePieChart({ transactions }) {
  const data = Object.values(
    transactions.reduce((acc, t) => {
      if (t.type === "expense") {
        acc[t.category] = acc[t.category] || {
          name: t.category,
          value: 0,
        };
        acc[t.category].value += Math.abs(t.amount);
      }
      return acc;
    }, {})
  );

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
  ];

  if (data.length === 0) return <p>No expense data</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
