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
import EditAccount from "./EditAccount";
import { logout } from "@/lib/features/auth/auth-slice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export const createColumns = (
  setTrigger: (trigger: boolean) => void
): ColumnDef<Account>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;
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
                onClick={() => navigator.clipboard.writeText(account.id)}
              >
                Copy account ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <EditAccount
                id={account.id}
                dropdownRef={dropdownRef as any}
                setTrigger={setTrigger}
                name={account.name}
                type={account.type}
              />
              <DropdownMenuItem
                variant={"destructive"}
                onClick={() => {
                  axios
                    .delete(
                      `${process.env.NEXT_PUBLIC_API_URL}/accounts/${account.id}`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem(
                            "accessToken"
                          )}`,
                        },
                      }
                    )
                    .then((response) => {
                      setTrigger(true);
                      toast.success("Account deleted successfully");
                    })
                    .catch((error) => {
                      toast.error("Error deleting account");
                    });
                }}
              >
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
        </DropdownMenu>
      );
    },
  },
];

function AccountsTable({
  triggered,
  setTrigger,
}: {
  triggered: boolean;
  setTrigger: (trigger: boolean) => void;
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const fetchData = async () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAccounts(response.data);
        setTrigger(false);
      })
      .catch((error) => {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        router.push("/");
      });
  };
  useEffect(() => {
    fetchData();
  }, [triggered, token]);
  return (
    <div className="w-full">
      <DataTable columns={createColumns(setTrigger)} data={accounts} />
    </div>
  );
}

export default AccountsTable;
