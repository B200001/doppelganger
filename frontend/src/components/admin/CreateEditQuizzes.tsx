import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/CreateEditQuizzes.scss';

interface Quiz {
  _id: string;
  title: string;
}

const CreateEditQuizzes:React.FC = () => {
  const token = useSelector((state: RootState) => state.admin.token);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [newQuizTitle, setNewQuizTitle] = useState<string>('');
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/quizzes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        } else {
          console.error('Failed to fetch quizzes');
        }
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      }
    };

    fetchQuizzes();
  }, [token]);

  const handleCreateQuiz = async () => {
    if (!newQuizTitle) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/create-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newQuizTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setQuizzes([...quizzes, data.quiz]);
        setNewQuizTitle('');
      } else {
        console.error('Failed to create quiz');
      }
    } catch (error) {
      console.error('Failed to create quiz', error);
    }
  };

  const handleEditQuiz = async (quizId: string, newTitle: string) => {
    if (!newTitle) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/edit-quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setQuizzes(
          quizzes.map((quiz) =>
            quiz._id === quizId ? { ...quiz, title: newTitle } : quiz
          )
        );
      } else {
        console.error('Failed to edit quiz');
      }
    } catch (error) {
      console.error('Failed to edit quiz', error);
    }
  };

  return (
    <div className="create-edit-quizzes">
      <h3>Create New Quiz</h3>
      <input
        type="text"
        placeholder="New Quiz Title"
        value={newQuizTitle}
        onChange={(e) => setNewQuizTitle(e.target.value)}
      />
      <button onClick={handleCreateQuiz}>Create Quiz</button>
      <h3>Edit Existing Quizzes</h3>
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="edit-quiz-item">
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => handleEditQuiz(quiz._id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default CreateEditQuizzes;
