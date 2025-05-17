"use client";
import CategoriesTable from "@/components/CategoriesTable";
import NeedAuth from "@/components/need-auth";
import NewCategory from "@/components/NewCategory";
import { useState } from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
function page() {
  const [trigger, setTrigger] = useState(false);
  const { first_name } = useSelector((state: RootState) => state.auth);
  return (
    <section
      className={`${
        first_name == "" ? "justify-center" : "p-6"
      } flex w-full flex-col items-center h-screen`}
    >
      {first_name == "" ? (
        <NeedAuth />
      ) : (
        <>
          <h1 className="text-2xl mb-4">Categories</h1>
          <CategoriesTable triggered={trigger} setTrigger={setTrigger} />
          <div className="flex flex-row items-center gap-4 justify-end w-full mt-6">
            <NewCategory setTrigger={setTrigger} />
          </div>
        </>
      )}
    </section>
  );
}

export default page;
