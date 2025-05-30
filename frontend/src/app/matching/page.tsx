"use client";
import React, { useState } from 'react';
import Image from 'next/image'
import NetworkCard from '../../components/networkCard'
import { profileCard } from '../../types/profile'
import '../../styles/Matching.css'
import SideBar from '@/components/sideBar';

export type Profile = {
  name: string,
  email: string,
  company: string,
  job_title: string,
  bio: string,
  image_src: string,
};

const MatchingPage: React.FC = () => {

    const [profIndex, setProfIndex] = useState(0);
    const [disabled, setDisabled] = useState(false);

    const dummyData1: profileCard = {
      name: 'John Doe',
      email: 'jdoe@gmail.com',
      company: 'Google',
      job_title: 'Software Engineer',
      bio: '',
      image_src: '/images/profile_template.png'
    };

    const dummyData2: profileCard = {
      name: 'Jane Doe',
      email: 'jdoe@gmail.com',
      company: 'Microsoft',
      job_title: 'Software Engineer',
      bio: '',
      image_src: '/images/profile_template2.png'
    };

    const dummyData3: profileCard = {
      name: 'Finished!',
      email: '',
      company: '',
      job_title: '',
      bio: '',
      image_src: '/icons/prof.svg'
    };

    const dummyData: Profile[] = JSON.parse(localStorage.getItem("profiles") ?? "");


    const handleClick = () => {
      setProfIndex(profIndex + 1);
      console.log(profIndex)
      if (profIndex >= dummyData.length - 2) {
        setDisabled(true);
      }
    }

    return(
        <div className="big-container">
            <aside className="h-screen sticky p-4 top-0 w-45 border-b border-b-gray-100 shadow-sm h-full"> 
              <SideBar />
            </aside>
          <main className="w-full p-4">
            <div className="matching-container">
              <button className="match-button" onClick={handleClick} disabled={disabled}>
                <Image 
                src="/icons/no.svg"
                alt="Swipe Left"
                width={30}
                height={30}
                />
              </button>
                <div className="card-container" >
                  <NetworkCard 
                      name={dummyData[profIndex].name}
                      email={dummyData[profIndex].email}
                      company={dummyData[profIndex].company}
                      bio={dummyData[profIndex].bio}
                      job_title={dummyData[profIndex].job_title}
                      image_src={dummyData[profIndex].image_src}
                  />
                </div>
                <button className="match-button" onClick={handleClick} disabled={disabled}>
                  <Image 
                  src="/icons/yes.svg"
                  alt="Swipe Right"
                  width={30}
                  height={30}
                  />
                </button>
            </div>
          </main>
        </div>
    )

}


export default MatchingPage;
