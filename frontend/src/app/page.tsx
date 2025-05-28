'use client';

import { request } from '@/app/lib/api';
import { redirect } from 'next/navigation';
import SideBar from '@/components/sideBar';

export default function Home() {

  const logout = () => {
    request('logout', 'DELETE');
    redirect('/login');
  };

  return (
    <div>
      <aside className="h-screen sticky p-4 top-0 w-45 border-b border-b-gray-100 shadow-sm h-full"> 
        <SideBar />
      </aside>
    </div>
  );
}
