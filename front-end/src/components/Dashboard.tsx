"use client";

import { Separator } from "@/components/ui/separator";
import AccountsListCards from "./AccountsListCards";
import RecentTransactions from "./RecentTransactions";
import Report from "./Report";

function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <AccountsListCards />
      <Separator className="my-4" />
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <RecentTransactions />
      </div>
      <div className="w-full mt-4">
        <Report />
      </div>
    </>
  );
}

export default Dashboard;
