import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/AnswerDetailPage.scss';

interface Answer {
  _id: string;
  user: number;
  dataset: string;
  image_name: string;
  listed_ans: string[];
  unlisted_ans: string;
  question_slug: string;
  createdAt: string;
}

const AnswerDetailPage:React.FC = () => {
  const { answerId } = useParams<{ answerId: string }>();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const token = useSelector((state: RootState) => state.admin.token);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/answers/${answerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAnswer(data);
        } else {
          console.error('Failed to fetch answer');
        }
      } catch (error) {
        console.error('Failed to fetch answer', error);
      }
    };

    fetchAnswer();
  }, [answerId, token]);

  if (!answer) {
    return <p>Loading...</p>;
  }

  return (
    <div className="answer-detail-page">
      <h2>Answer Details</h2>
      <p>User ID: {answer.user}</p>
      <p>Dataset: {answer.dataset}</p>
      <p>Image Name: {answer.image_name}</p>
      <p>Answered At: {new Date(answer.createdAt).toLocaleString()}</p>
      <p>Question Slug: {answer.question_slug}</p>
      <div>
        <p>Listed Answers:</p>
        <ul>
          {answer.listed_ans.map((ans, index) => (
            <li key={index}>{ans}</li>
          ))}
        </ul>
      </div>
      {answer.unlisted_ans && (
        <p>Unlisted Answer: {answer.unlisted_ans}</p>
      )}
    </div>
  );
};

export default AnswerDetailPage;
