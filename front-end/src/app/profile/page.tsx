'use client';

import NeedAuth from '@/components/need-auth';
import Profile from '@/components/Profile';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';

function page() {
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
          <h1 className='text-2xl mb-4'>Profile</h1>
          <Profile />
        </>
      )}
    </section>
  );
}

export default page;
