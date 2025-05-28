'use client';
import Link from 'next/link'
import '../styles/SideBar.css'
import { request } from '@/app/lib/api';
import { redirect } from 'next/navigation';

const SideBar: React.FC = () => {

    const logout = () => {
        request('logout', 'DELETE');
        redirect('/login');
      };

    return (
    <div> 
        <Link className="link" href="/"><h4>Careerify</h4></Link>
        <div className='line'></div>
        <br />
        <Link className="link" href="/quiz">Quiz</Link>
        <br />
        <br />
        <Link className="link" href="/matching">Matching</Link>
        <br />
        <br />
        <Link className="link" href="/profile">Connections</Link>
        <br />
        <br />
        <Link className="link" href="/" onClick={logout}>Logout</Link>
    </div>
    )
}

export default SideBar;