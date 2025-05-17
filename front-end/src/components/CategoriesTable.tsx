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
import EditCategory from "./EditCategory";
import { logout } from "@/lib/features/auth/auth-slice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
interface Category {
  id: string;
  name: string;
}

export const createColumns = (
  setTrigger: (trigger: boolean) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category ID
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
          Category Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
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
                onClick={() => navigator.clipboard.writeText(category.id)}
              >
                Copy category ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <EditCategory
                id={category.id}
                dropdownRef={dropdownRef as any}
                setTrigger={setTrigger}
                name={category.name}
              />
              <DropdownMenuItem
                variant={"destructive"}
                onClick={() => {
                  fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`,
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
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
        </DropdownMenu>
      );
    },
  },
];

function CategoriesTable({
  triggered,
  setTrigger,
}: {
  triggered: boolean;
  setTrigger: (trigger: boolean) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      localStorage.removeItem("accessToken");
      dispatch(logout());
      router.push("/");
    }
    setCategories(data);
    setTrigger(false);
    console.log(data);
  };
  useEffect(() => {
    fetchData();
  }, [triggered, token]);
  return (
    <div className="w-full">
      <DataTable columns={createColumns(setTrigger)} data={categories} />
    </div>
  );
}

export default CategoriesTable;
