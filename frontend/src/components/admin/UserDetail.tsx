import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/UserDetail.scss';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  gender: string;
  city: string;
  affiliated_org: string;
  date_of_birth: string;
  education: string;
  occupation: string;
  phone_no: string;
  inspection_interest: string;
  work_hours: string;
  extra_work: string[];
  profile_slug: string;
  picture: string;
  pin: string;
  state: string;
}

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const token = useSelector((state: RootState) => state.admin.token);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAnswerCount(data.answerCount);
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Failed to fetch user details', error);
      }
    };

    const fetchTotalQuestions = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/total-questions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTotalQuestions(data.totalQuestions);
        } else {
          console.error('Failed to fetch total questions');
        }
      } catch (error) {
        console.error('Failed to fetch total questions', error);
      }
    };

    fetchUserDetails();
    fetchTotalQuestions();
  }, [userId, token]);

  const handleRemoveUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        navigate('/admin/users');
      } else {
        console.error('Failed to remove user');
      }
    } catch (error) {
      console.error('Failed to remove user', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-detail">
      <h2>User Details</h2>
      <div className="user-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Sign Up Date:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        <p><strong>Questions Answered:</strong> {answerCount} / {totalQuestions}</p>
        <p><strong>City:</strong> {user.city}</p>
        <p><strong>State:</strong> {user.state}</p>
        <p><strong>PIN:</strong> {user.pin}</p>
        <p><strong>Date of Birth:</strong> {new Date(user.date_of_birth).toLocaleDateString()}</p>
        <p><strong>Education Level:</strong> {user.education}</p>
        <p><strong>Occupation:</strong> {user.occupation}</p>
        <p><strong>Affiliated Organization:</strong> {user.affiliated_org}</p>
        <p><strong>Phone Number:</strong> {user.phone_no}</p>
        <p><strong>Inspection Interest:</strong> {user.inspection_interest}</p>
        <p><strong>Weekly Hours:</strong> {user.work_hours}</p>
      </div>
      <div className="contributions">
        <strong>Extra Work:</strong>
        {user.extra_work.map((work, index) => (
          <p key={index}>{work}</p>
        ))}
      </div>
      <div className="user-actions">
        <button className="btn" onClick={handleRemoveUser}>Remove User</button>
      </div>
    </div>
  );
};

export default UserDetail;
