import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/ManageQuizzes.scss';

interface Quiz {
  _id: string;
  title: string;
  questions: any[];
  examples: any[];
  options: any[];
}

const ManageQuizzes: React.FC = () => {
  const navigate = useNavigate();
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
  }, [token, baseUrl]);

  const handleCreateQuiz = async () => {
    if (!newQuizTitle) return;

    const newQuiz = {
      title: newQuizTitle,
      mainQuestion: "Main question text", // Replace with actual main question
      options: ["Spiral", "Bar", "EdgeOn", "Ring", "Interacting Galaxies", "Tidal Tails", "Galaxy Group", "Mergers", "Smooth", "Do you see any feature not listed above"],
      examples: [], // Add example objects if necessary
      description: "Quiz description", // Replace with actual description
      status: "ONGOING" // Replace with actual status
    };

    try {
      const response = await fetch(`${baseUrl}/api/admin/create-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newQuiz),
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

  const handleEditQuiz = (quizId: string) => {
    navigate(`/admin/manage-quizzes/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/delete-quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Quiz deleted successfully');
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      } else {
        console.error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Failed to delete quiz', error);
    }
  };

  return (
    <div className="manage-quizzes">
      <h3>Manage Quizzes</h3>
      <div className="create-quiz">
        <h4>Create New Quiz</h4>
        <input
          type="text"
          placeholder="New Quiz Title"
          value={newQuizTitle}
          onChange={(e) => setNewQuizTitle(e.target.value)}
        />
        <button onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
      <div className="quiz-list">
        <h4>Existing Quizzes</h4>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Questions</th>
              <th>Examples</th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.title}</td>
                <td>{quiz.questions.length}</td>
                <td>{quiz.examples.length}</td>
                <td>{quiz.options.length}</td>
                <td>
                  <button onClick={() => handleEditQuiz(quiz._id)}>Edit</button>
                  <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageQuizzes;
