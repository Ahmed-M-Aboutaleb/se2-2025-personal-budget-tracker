"use client";
import { RootState } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Legend,
  BarChart,
  TooltipProps,
  PieChart,
  Pie,
  Cell,
} from "recharts";
interface Entry {
  id: string;
  account: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
  category: {
    id: string;
    name: string;
  };
  description: string;
  date: string;
  amount: number;
  expense: boolean;
}

function ExpencesPerCategoryChart({ entries }: { entries: Entry[] }) {
  const data = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};

    console.log("Processing entries:", entries);

    entries.forEach((entry) => {
      if (entry.expense) {
        const amount = Math.abs(entry.amount);
        if (categoryMap[entry.category.name]) {
          categoryMap[entry.category.name] += amount;
        } else {
          categoryMap[entry.category.name] = amount;
        }
      }
    });

    const result = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    console.log("Chart data:", result);
    return result;
  }, [entries]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        No expense data available to display
      </div>
    );
  }

  const RADIAN = Math.PI / 180.0;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    index: number;
  }) => {
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    const percentage = ((data[index].value / total) * 100).toFixed(0);
    if (data[index].value === 0) return null;
    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize={12}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${data[index].name} ${percentage}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={160}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                [
                  "#0088FE",
                  "#00C49F",
                  "#FFBB28",
                  "#FF8042",
                  "#A28CFF",
                  "#FF6B6B",
                  "#4BC0C0",
                ][index % 7]
              }
              style={{ stroke: "#1f1f1f" }}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function MonthlyExpensesChart({ entries }: { entries: Entry[] }) {
  const data = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    entries.forEach((entry) => {
      if (entry.expense) {
        const date = new Date(entry.date);
        const monthYear = date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });

        const amount = Math.abs(entry.amount);
        if (monthlyData[monthYear]) {
          monthlyData[monthYear] += amount;
        } else {
          monthlyData[monthYear] = amount;
        }
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const result = sortedMonths.map((month) => ({
      month,
      amount: monthlyData[month],
    }));

    console.log("Monthly expenses data:", result);
    return result;
  }, [entries]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        No monthly expense data available to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Expenses"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Legend />
        <Bar dataKey="amount" name="Monthly Expenses" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function IncomeVsExpenseChart({ entries }: { entries: Entry[] }) {
  const data = useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } =
      {};

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const monthYear = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      const amount = Math.abs(entry.amount);

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expenses: 0 };
      }

      if (entry.expense) {
        monthlyData[monthYear].expenses += amount;
      } else {
        monthlyData[monthYear].income += amount;
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const result = sortedMonths.map((month) => ({
      month,
      income: monthlyData[month].income,
      expenses: monthlyData[month].expenses,
    }));

    console.log("Income vs Expenses data:", result);
    return result;
  }, [entries]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        No income/expense data available to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, ""]} />
        <Legend />
        <Bar dataKey="income" name="Income" stackId="a" fill="#00C49F" />
        <Bar dataKey="expenses" name="Expenses" stackId="a" fill="#FF8042" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Report() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/entries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }

      const data = await response.json();
      console.log("Raw entries data:", data);

      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date).toLocaleDateString("en-US"),
          amount: transaction.amount,
        }));
        setEntries(formattedData);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  if (loading) {
    return <div className="p-4">Loading expense reports...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Expenses By Category</h2>
        <ExpencesPerCategoryChart entries={entries} />
      </div>

      <div>
        <h2 className="text-2xl font-bold">Monthly Expenses</h2>
        <MonthlyExpensesChart entries={entries} />
      </div>

      <div>
        <h2 className="text-2xl font-bold">Income vs Expenses</h2>
        <IncomeVsExpenseChart entries={entries} />
      </div>
    </div>
  );
}

export default Report;
