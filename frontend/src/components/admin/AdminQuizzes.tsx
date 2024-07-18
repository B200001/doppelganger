import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/AdminQuizzes.scss';

interface Question {
  question: string;
  question_image: string;
  options: string[];
}

interface Example {
  example_image: string;
  description: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  examples: Example[];
}

const AdminQuizzes: React.FC = () => {
  const token = useSelector((state: RootState) => state.admin.token);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [newQuizTitle, setNewQuizTitle] = useState<string>('');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [exampleFileInput, setExampleFileInput] = useState<FileList | null>(null);
  const [newExampleDescription, setNewExampleDescription] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newQuestionImage, setNewQuestionImage] = useState<string>('');
  const [newOption, setNewOption] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileInput(e.target.files);
  };

  const handleExampleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExampleFileInput(e.target.files);
  };

  const handleUploadImages = async () => {
    if (!fileInput || !selectedQuizId) return;

    const formData = new FormData();
    formData.append('quizId', selectedQuizId);
    for (let i = 0; i < fileInput.length; i++) {
      formData.append('images', fileInput[i]);
    }

    try {
      const response = await fetch(`${baseUrl}/api/admin/add-images-to-quiz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        console.log(data);
      } else {
        console.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Failed to upload images', error);
    }
  };

  const handleUploadExamples = async () => {
    if (!exampleFileInput || !selectedQuizId || !newExampleDescription) return;

    const formData = new FormData();
    formData.append('quizId', selectedQuizId);
    formData.append('description', newExampleDescription);
    for (let i = 0; i < exampleFileInput.length; i++) {
      formData.append('examples', exampleFileInput[i]);
    }

    try {
      const response = await fetch(`${baseUrl}/api/admin/add-examples-to-quiz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        console.log(data);
      } else {
        console.error('Failed to upload examples');
      }
    } catch (error) {
      console.error('Failed to upload examples', error);
    }
  };

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

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/delete-quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
      } else {
        console.error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Failed to delete quiz', error);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, newOption]);
    setNewOption('');
  };

  const handleCreateQuestion = async () => {
    if (!selectedQuizId || !newQuestion || !newQuestionImage || options.length === 0) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/add-question-to-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: selectedQuizId,
          question: {
            question: newQuestion,
            question_image: newQuestionImage,
            options,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setNewQuestion('');
        setNewQuestionImage('');
        setOptions([]);
      } else {
        console.error('Failed to create question');
      }
    } catch (error) {
      console.error('Failed to create question', error);
    }
  };

  return (
    <div className="admin-quizzes">
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
      <div className="edit-quiz">
        <h4>Edit Existing Quizzes</h4>
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="edit-quiz-item">
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => handleEditQuiz(quiz._id, e.target.value)}
            />
            <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="image-upload">
        <h4>Upload New Images</h4>
        <select onChange={(e) => setSelectedQuizId(e.target.value)} value={selectedQuizId}>
          <option value="">Select a Quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz._id} value={quiz._id}>
              {quiz.title}
            </option>
          ))}
        </select>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUploadImages}>Upload Images</button>
      </div>
      <div className="example-upload">
        <h4>Upload New Examples</h4>
        <select onChange={(e) => setSelectedQuizId(e.target.value)} value={selectedQuizId}>
          <option value="">Select a Quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz._id} value={quiz._id}>
              {quiz.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Example Description"
          value={newExampleDescription}
          onChange={(e) => setNewExampleDescription(e.target.value)}
        />
        <input type="file" multiple onChange={handleExampleFileChange} />
        <button onClick={handleUploadExamples}>Upload Examples</button>
      </div>
      <div className="create-question">
        <h4>Create New Question</h4>
        <select onChange={(e) => setSelectedQuizId(e.target.value)} value={selectedQuizId}>
          <option value="">Select a Quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz._id} value={quiz._id}>
              {quiz.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Question Text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Question Image URL"
          value={newQuestionImage}
          onChange={(e) => setNewQuestionImage(e.target.value)}
        />
        <div className="options">
          <input
            type="text"
            placeholder="New Option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
          <button onClick={handleAddOption}>Add Option</button>
          <ul>
            {options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
        <button onClick={handleCreateQuestion}>Create Question</button>
      </div>
    </div>
  );
};

export default AdminQuizzes;
