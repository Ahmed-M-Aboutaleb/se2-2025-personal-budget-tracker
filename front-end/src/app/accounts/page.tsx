'use client';
import AccountsTable from '@/components/AccountsTable';
import NeedAuth from '@/components/need-auth';
import NewAccount from '@/components/NewAccount';
import { RootState } from '@/lib/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
function page() {
  const [trigger, setTrigger] = useState(false);
  const { first_name } = useSelector((state: RootState) => state.auth);
  return (
    <section
      className={`${
        first_name == '' && 'justify-center'
      } flex w-full flex-col items-center h-screen p-6`}
    >
      {first_name == '' ? (
        <NeedAuth />
      ) : (
        <>
          <h1 className='text-2xl mb-4'>Accounts</h1>
          <AccountsTable triggered={trigger} setTrigger={setTrigger} />
          <div className='flex flex-row items-center gap-4 justify-end w-full mt-6'>
            <NewAccount setTrigger={setTrigger} />
          </div>
        </>
      )}
    </section>
  );
}

export default page;
