"use client";
type Transaction = {
  id: number;
  userId: string;
  account: {
    id: number;
    name: string;
    type: string;
    balance: number;
  };
  category: {
    id: number;
    name: string;
  };
  amount: number;
  date: string;
  description: string;
  type: string;
};

import { ColumnDef } from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import DataTable from "./data-table";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "account.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
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
        const data = await response.json();
        const formattedData = await data.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date).toLocaleDateString("en-US"),
          amount:
            transaction.expense === false
              ? transaction.amount
              : -transaction.amount,
          type: transaction.expense === false ? "Income" : "Expense",
        }));
        setTransactions(formattedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [token]);
  return (
    <div>
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}

export default RecentTransactions;
