'use client';
import React from 'react';
import { profileCard } from '../types/profile'
import Image from 'next/image'
import '../styles/NetworkCard.css'

const NetworkCard: React.FC<profileCard> = ({name, email, company, bio, job_title, image_src}) => {

    let job = '';
    if (job_title !== '') {
        job = `${job_title} @ ${company}`
    } else {
        job = "Refresh for more profiles \n"
    }
    return(
        <div className="profile-card">
            <Image src={image_src} alt="profile image" width={230} height={230} className='profile-image'/>
            <h2 className="profile-card-title">{name}</h2>
            <div className="prof-line">&nbsp;</div>
            <h4 className="profile-card-info">{job}</h4>
            <h4 className="profile-card-info">{email}&nbsp;</h4>
            {/* <p>{bio}</p> */}
        </div>
    );

}


export default NetworkCard;