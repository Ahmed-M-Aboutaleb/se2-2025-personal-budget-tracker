"use client";
import Dashboard from "@/components/Dashboard";
import NeedAuth from "@/components/need-auth";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Home() {
  const { first_name } = useSelector((state: RootState) => state.auth);

  return (
    <section
      className={`${
        first_name == "" ? "flex flex-col items-center justify-center" : "p-6"
      } w-full h-screen`}
    >
      {first_name == "" ? <NeedAuth /> : <Dashboard />}
    </section>
  );
}
