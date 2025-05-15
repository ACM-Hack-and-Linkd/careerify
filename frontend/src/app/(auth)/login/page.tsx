'use client';

import { LoginFormElement } from '@/app/lib/definitions';
import { login } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Page() {

  const handleLogin = async (event: React.FormEvent<LoginFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.elements.email.value;
    const password = event.currentTarget.elements.password.value;

    if (!email || !password) {
      alert("Please enter an email and password!")
    } else if (await login(event)) {
      redirect('/');
    } else {
      alert('Incorrect email or password!');
    }
  };

  return (
    <main className="w-1/2">
      <h1>Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 text-center">
        <input id="email" name="email" type="email" placeholder="Enter email" className="border-1"/>
        <input id="password" name="password" type="password" placeholder="Enter password" className="border-1"/>
        
        <button type="submit" className='bg-blue-200 cursor-pointer'>Login</button>

        <p>Don't have an account? <Link href={"/signup"} className="text-primary hover:underline focus:underline focus-visible:outline-none">Sign up</Link></p>
      </form>

    </main>
  );
}
