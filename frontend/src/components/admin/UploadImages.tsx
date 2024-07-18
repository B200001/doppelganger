import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/UploadImages.scss';

interface Quiz {
  _id: string;
  title: string;
}

const UploadImages = () => {
  const token = useSelector((state: RootState) => state.admin.token);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [fileInput, setFileInput] = useState<FileList | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileInput(e.target.files);
  };

  const handleUploadImages = async () => {
    if (!fileInput || !selectedQuiz) return;

    const formData = new FormData();
    formData.append('quizTitle', selectedQuiz);
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

  return (
    <div className="image-upload">
      <h3>Upload New Images</h3>
      <select onChange={(e) => setSelectedQuiz(e.target.value)} value={selectedQuiz}>
        <option value="">Select a Quiz</option>
        {quizzes.map((quiz) => (
          <option key={quiz._id} value={quiz.title}>
            {quiz.title}
          </option>
        ))}
      </select>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUploadImages}>Upload</button>
    </div>
  );
};

export default UploadImages;
