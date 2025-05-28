'use client';
import Link from 'next/link'
import '../styles/SideBar.css'

const SideBar: React.FC = () => {

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
    </div>
    )
}

export default SideBar;