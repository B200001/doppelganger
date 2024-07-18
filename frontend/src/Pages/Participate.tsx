import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import DOMPurify from 'dompurify';
import '../styles/Participate.scss';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const Participate: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const currentUser = useSelector((state: RootState) => state.user?.currentUser);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL;
  const token = currentUser?.token;

  useEffect(() => {
    console.log(token); // Log token for debugging
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/quizzes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log response data for debugging
          setQuizzes(data);
        } else {
          console.error('Failed to fetch quizzes', response.status, response.statusText); // Log response status and text
        }
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchQuizzes();
    } else {
      setLoading(false);
    }
  }, [baseUrl, token]);

  const handleNavigateToQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="participate container">
      <h1 className="text-center">Participate in the Citizen Science Project</h1>
      <h3 className="text-center">The datasets where your participation would be appreciated:</h3>
      <div className="content">
        {quizzes.filter(quiz => quiz.status === 'ONGOING').map((quiz) => (
          <div className="section" key={quiz._id}>
            <ul>
              <li>ONGOING</li>
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quiz.description) }}></p>
            </ul>
            <div className="text-center">
              <button onClick={() => handleNavigateToQuiz(quiz._id)} className="btn btn-primary">
                {quiz.title}
              </button>
            </div>
          </div>
        ))}
        {quizzes.filter(quiz => quiz.status === 'UPCOMING').map((quiz) => (
          <div className="section" key={quiz._id}>
            <ul>
              <li>UPCOMING</li>
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quiz.description) }}></p>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participate;
{/* <div className="section">
          <ul>
            <li>UPCOMING</li>
            <p>
              We are interested in exploring spectral features (absorption, emission lines, reliably
              estimating the emission redshift, etc.) from DR16 Quasar data <a href="http://skyserver.sdss.org/dr16/en/home.aspx">data information here</a>
            </p>
          </ul>
        </div>
      </div> */}