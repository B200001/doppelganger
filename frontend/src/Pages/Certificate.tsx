import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import '../styles/Certificate.scss';
import Part_img from "../assets/Participation.png";

const Certificate: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [userName, setUserName] = useState('');
  const [answerCount, setAnswerCount] = useState(0);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.username);
          setAnswerCount(data.answers.length);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser, baseUrl]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cert-container">
      <div className="cert">
        <img src={Part_img} className="cert-bg" alt="Certificate Background" />
        <div className="cert-content">
          <h1>Certificate of Participation</h1>
          <p>This certificate is presented to</p>
          <u><b><h2>{userName}</h2></b></u>
          <p>In recognition of your participation in identifying features from <u><b>{answerCount}</b></u> images from Pune Knowledge
            Cluster's Citizen Science Programme: <b>One Million Galaxies</b>.
          </p>
        </div>
      </div>
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">Print Certificate</button>
      </div>
    </div>
  );
};

export default Certificate;
