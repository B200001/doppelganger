import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.scss';

interface Answer {
  _id: string;
  ans_time: string;
  dataset: string;
  image_name: string;
  listed_ans: string[];
  unlisted_ans: string;
  question_slug: string;
}

interface User {
  username: string;
  email: string;
  phone_no: string;
  date_of_birth: string;
  gender: string;
  occupation: string;
  education: string;
  city: string;
  state: string;
  pin: string;
  affiliated_org: string;
  inspection_interest: string;
  work_hours: string;
  extra_work: string[];
  picture: string;
}

interface Quiz {
  _id: string;
  questions: any[];
}

const UserProfile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [badge, setBadge] = useState<string>('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          setUserAnswers(data.answers);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/quizzes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        } else {
          console.error('Failed to fetch quizzes');
        }
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
    };

    fetchUserData();
    fetchQuizzes();
  }, [currentUser, navigate, baseUrl]);

  useEffect(() => {
    if (quizzes.length > 0 && userAnswers.length >= 0) {
      getBadge();
    }
  }, [quizzes, userAnswers]);

  const getBadge = () => {
    const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    const percent = (userAnswers.length / totalQuestions) * 100;
    if (percent <= 33) {
      setBadge('learner');
    } else if (percent > 33 && percent <= 66) {
      setBadge('bronze');
    } else if (percent > 66 && percent <= 90) {
      setBadge('silver');
    } else {
      setBadge('gold');
    }
  };

  const getBadgeImage = (badge: string) => {
    switch (badge) {
      case 'learner':
        return 'https://img.icons8.com/external-justicon-lineal-justicon/64/000000/external-medal-awards-justicon-lineal-justicon-4.png';
      case 'bronze':
        return 'https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-medal-awards-justicon-flat-justicon-2.png';
      case 'silver':
        return 'https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-medal-awards-justicon-flat-justicon-1.png';
      case 'gold':
        return 'https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-medal-awards-justicon-flat-justicon.png';
      default:
        return '';
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('picture', e.target.files[0]);

      try {
        const response = await fetch(`${baseUrl}/api/users/profile/picture`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUserData((prevData) => ({
            ...prevData!,
            picture: data.picture,
          }));
        } else {
          console.error('Failed to update profile picture');
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  };

  const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <div className="profile-image-wrapper">
          <img
            src={userData?.picture ? `${baseUrl}/${userData.picture}` : 'default_profile_picture.png'}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-image-overlay" onClick={() => document.getElementById('file-upload')?.click()}>
            <label htmlFor="file-upload" className="upload-label">Change Picture</label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="file-input"
            />
          </div>
        </div>
        <div className="profile-info">
          <h2>{userData?.username || 'User Name'}</h2>
          <p>{userData?.email}, {userData?.phone_no}</p>
          <p>{userData?.city}, {userData?.state}</p>
          <p>Occupation: {userData?.occupation}</p>
          <p>Affiliated Organisation: {userData?.affiliated_org || 'None'}</p>
        </div>
        <div className="profile-actions">
          <a href="https://www.linkedin.com/company/pune-knowledge-cluster-pkc/" target="_blank" rel="noopener noreferrer" className="btn btn-info">Connect</a>
          <a href="https://www.pkc.org.in/" target="_blank" rel="noopener noreferrer" className="btn btn-default">PKC</a>
        </div>
        <div className="profile-stats">
          <div>
            <span className="heading">{userAnswers.length}</span>
            <span className="description">Galaxies explored</span>
          </div>
          <div>
            <span className="heading">{totalQuestions - userAnswers.length}</span>
            <span className="description">Galaxies remaining</span>
          </div>
        </div>
        <h3>
          Performance level: <span>{badge}</span>
          {badge && <img src={getBadgeImage(badge)} alt="badge" className="badge-image" />}
        </h3>
        <a href="#" className="info-link">How do we count above explored and remaining galaxies?</a>
        <div className="action-buttons">
          <a className="btn btn-secondary" href="/participate/galaxy/hsc_data/">Jump to galaxy analysis</a>
          <a className="btn btn-secondary" href="/certificate" target="_blank" rel="noopener noreferrer">Download Participation Certificate</a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
