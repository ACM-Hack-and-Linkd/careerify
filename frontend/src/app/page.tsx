'use client';

import SideBar from '@/components/sideBar';

export default function Home() {
  return (
    <div>
      <aside className="h-screen sticky p-4 top-0 w-45 border-b border-b-gray-100 shadow-sm h-full"> 
        <SideBar />
      </aside>
    </div>
  );
}
