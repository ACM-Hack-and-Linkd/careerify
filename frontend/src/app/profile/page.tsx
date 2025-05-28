"use client";
import React, { useState } from 'react';
import SideBar from '@/components/sideBar'
import Accordion from 'react-bootstrap/Accordion';
import { profileCard } from '../../types/profile'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Profile.css'

const ProfilePage: React.FC = () => {

    const dummyData: profileCard[] = [
        {
            name: 'Connection 1',
            company: 'Google',
            job_title: 'Software Engineer',
            bio: 'Hello! I am a SWE at Google who loves leetcode, sweatpants, and coffee.',
            image_src: '/public/profile_template.png',
            email: 'test@gmail.com'
        },
        {
            name: 'Connection 2',
            company: 'Microsoft',
            job_title: 'Software Engineer',
            bio: "What's up y'all!! Excited to connect. Shoot me an email at the address above.",
            image_src: '/public/profile_template.png',
            email: 'test2@gmail.com'
        }
    ]

    return(
        <div className="big-container">
            <aside className="h-screen sticky p-4 top-0 w-45 border-b border-b-gray-100 shadow-sm h-full"> 
              <SideBar />
            </aside>
            <main className="w-full p-4 h-full align-top">
                <div className="profile-container">
                <h2 className="accordian-title">Connections</h2>
                <Accordion>
                    {dummyData.map((connection, index) =>
                        <Accordion.Item key={index} eventKey={connection.email}>
                            <Accordion.Header>{connection.name}: {connection.company}</Accordion.Header>
                            <Accordion.Body>
                                <strong>Job Title:</strong> {connection.job_title}
                                <br />
                                <strong>Email:</strong> {connection.email}
                                <br />
                                <br />
                                {connection.bio}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                </Accordion>
                </div>
            </main>
        </div>
    )

};


export default ProfilePage;