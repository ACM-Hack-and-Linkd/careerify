'use client';

import { SignUpFormElement } from '@/app/lib/definitions';
import { signUp } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Page() {  
  const handleSignUp = async (event: React.FormEvent<SignUpFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.elements.email.value;
    const name = event.currentTarget.elements.name.value;
    const password = event.currentTarget.elements.password.value;

    if (!email || !name || !password) {
      alert("Please enter an email, name, and password!")
    } else if (await signUp(event)) {
      redirect('/');
    } else {
      alert('User already exists with that email!');
    }
  };

  return (
    <main className="w-1/2">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignUp} className="flex flex-col gap-4 text-center">
        <input id="email" name="email" type="email" placeholder="Enter your email" className="border-1"/>
        <input id="name" name="name" type="name" placeholder="Enter your name" className="border-1"/>
        <input id="password" name="password" type="password" placeholder="Enter your password" className="border-1"/>
        
        <button type="submit" className='bg-blue-200 cursor-pointer'>Sign Up</button>

        <p>Already have an account? <Link href={"/login"} className="text-primary hover:underline focus:underline focus-visible:outline-none">Login</Link></p>
      </form>

    </main>
  );
}
