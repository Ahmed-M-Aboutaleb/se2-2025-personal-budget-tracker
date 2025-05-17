"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "./data-table";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import EditEntry from "./EditEntry";

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

export const createColumns = (
  setTrigger: (trigger: boolean) => void
): ColumnDef<Entry>[] => [
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
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original;
      const dropdownRef = useRef<HTMLDivElement>(null);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <div ref={dropdownRef}>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>{" "}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(entry.id)}
              >
                Copy entry ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <EditEntry
                id={entry.id}
                dropdownRef={dropdownRef as any}
                setTrigger={setTrigger}
                categoryID={parseInt(entry.category.id)}
                description={entry.description}
                date={entry.date}
                amount={entry.amount}
                expense={entry.expense}
              />
              <DropdownMenuItem
                variant={"destructive"}
                onClick={() => {
                  fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/entries/${entry.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  ).then((response) => {
                    if (!response.ok) {
                      response.json().then((data) => console.log(data));
                      throw new Error("Network response was not ok");
                    }
                    if (response.ok) {
                      setTrigger(true);
                    }
                  });
                }}
              >
                Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
        </DropdownMenu>
      );
    },
  },
];

function EntriesTable({
  triggered,
  setTrigger,
}: {
  triggered: boolean;
  setTrigger: (trigger: boolean) => void;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const fetchData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/entries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
    setEntries(formattedData);
    setTrigger(false);
    console.log(data);
  };
  useEffect(() => {
    fetchData();
  }, [triggered, token]);
  return (
    <div className="w-full">
      <DataTable columns={createColumns(setTrigger)} data={entries} />
    </div>
  );
}

export default EntriesTable;
