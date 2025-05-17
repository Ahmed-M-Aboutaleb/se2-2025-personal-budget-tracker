"use client";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "./ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { logout } from "@/lib/features/auth/auth-slice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";

function AccountsLoading() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function AccountsCard({ account }: any) {
  return (
    <Card className="w-[250px] h-[125px] bg-white shadow-md rounded-xl">
      <CardHeader>
        <CardTitle>{account.name}</CardTitle>
        <CardDescription>{account.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-black">Balance: {account.balance}$</p>
      </CardContent>
    </Card>
  );
}

function AccountsListCards() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAccounts(response.data);
        const total = response.data.reduce((acc: number, account: any) => {
          return acc + account.balance;
        }, 0);
        setTotalBalance(total);
        setLoading(false);
      })
      .catch((error) => {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        router.push("/");
      });
  }, []);
  return (
    <div>
      {loading ? (
        <div className="flex flex-wrap gap-6 justify-center">
          <AccountsLoading />
          <AccountsLoading />
          <AccountsLoading />
          <AccountsLoading />
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No accounts available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account: any) => (
              <AccountsCard key={account.id} account={account} />
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">
              Total Balance: {totalBalance}$
            </h2>
          </div>
        </>
      )}
    </div>
  );
}

export default AccountsListCards;
