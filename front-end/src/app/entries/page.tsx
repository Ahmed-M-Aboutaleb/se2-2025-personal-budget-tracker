"use client";
import EntriesTable from "@/components/EntriesTable";
import NeedAuth from "@/components/need-auth";
import NewEntry from "@/components/NewEntry";
import { RootState } from "@/lib/store";
import { useState } from "react";
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
          <h1 className="text-2xl mb-4">Entries</h1>
          <EntriesTable triggered={trigger} setTrigger={setTrigger} />
          <div className="flex flex-row items-center gap-4 justify-end w-full mt-6">
            <NewEntry setTrigger={setTrigger} />
          </div>
        </>
      )}
    </section>
  );
}

export default page;
