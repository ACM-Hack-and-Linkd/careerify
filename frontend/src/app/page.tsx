'use client';

import { request } from '@/app/lib/api';
import { redirect } from 'next/navigation';

export default function Home() {

  const logout = () => {
    request('logout', 'DELETE');
    redirect('/login');
  };

  return (
    <main>
      <h1>Careerify!</h1>
      <button onClick={logout} className="cursor-pointer">Logout</button>
    </main>
  );
}
