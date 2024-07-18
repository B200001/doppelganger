import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/EditQuiz.scss';

interface Option {
  text: string;
}

interface Question {
  question_image: string;
  question_slug: string;
  is_answered: boolean;
  _id: string;
}

interface Example {
  _id: string;
  example_image: string;
  description: string;
}

interface Quiz {
  _id: string;
  title: string;
  mainQuestion: string;
  questions: Question[];
  options: Option[];
  examples: Example[];
  description: string;
  status: string;
}

const EditQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const token = useSelector((state: RootState) => state.admin.token);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [mainQuestion, setMainQuestion] = useState<string>('');
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [exampleInput, setExampleInput] = useState<FileList | null>(null);
  const [newExampleDescription, setNewExampleDescription] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('ONGOING');
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/admin/quizzes/${quizId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
          setNewTitle(data.title);
          setMainQuestion(data.mainQuestion || "");
          setDescription(data.description || "");
          setStatus(data.status || "ONGOING");
        } else {
          console.error('Failed to fetch quiz');
        }
      } catch (error) {
        console.error('Failed to fetch quiz', error);
      }
    };

    fetchQuiz();
  }, [token, quizId, baseUrl]);

  const handleUpdateQuiz = async () => {
    if (!newTitle || !mainQuestion || !description || !status || !quiz) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/edit-quiz/${quiz._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, mainQuestion, options: quiz.options, description, status }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setQuiz(data.quiz);
      } else {
        console.error('Failed to update quiz');
      }
    } catch (error) {
      console.error('Failed to update quiz', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileInput(e.target.files);
  };

  const handleExampleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExampleInput(e.target.files);
  };

  const uploadFiles = async (files: FileList, url: string) => {
    const CHUNK_SIZE = 20; // Adjust chunk size as necessary
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i += CHUNK_SIZE) {
      const chunk = fileArray.slice(i, i + CHUNK_SIZE);
      const formData = new FormData();
      formData.append('quizId', quiz?._id || '');
      chunk.forEach(file => {
        formData.append('images', file);
      });

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          console.error('Failed to upload chunk', response.statusText);
          break;
        }
      } catch (error) {
        console.error('Failed to upload chunk', error);
        break;
      }
    }
  };

  const handleUploadImages = async () => {
    if (!fileInput || !quiz) return;
    await uploadFiles(fileInput, `${baseUrl}/api/admin/add-images-to-quiz`);
  };

  const handleUploadExamples = async () => {
    if (!exampleInput || !quiz || !newExampleDescription) return;
    await uploadFiles(exampleInput, `${baseUrl}/api/admin/add-examples-to-quiz`);
  };

  const handleRemoveExample = async (exampleId: string) => {
    if (!quiz) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/quizzes/${quiz._id}/examples/${exampleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setQuiz(data.quiz);
      } else {
        console.error('Failed to remove example');
      }
    } catch (error) {
      console.error('Failed to remove example', error);
    }
  };

  const handleOptionChange = (optionIndex: number, newOption: string) => {
    if (!quiz) return;
    const updatedOptions = [...quiz.options];
    updatedOptions[optionIndex].text = newOption;
    setQuiz({ ...quiz, options: updatedOptions });
  };

  const addOption = () => {
    if (!quiz) return;
    const updatedOptions = [...quiz.options, { text: '' }];
    setQuiz({ ...quiz, options: updatedOptions });
  };

  const removeOption = (optionIndex: number) => {
    if (!quiz) return;
    const updatedOptions = quiz.options.filter((_, index) => index !== optionIndex);
    setQuiz({ ...quiz, options: updatedOptions });
  };

  return (
    <div className="edit-quiz">
      {quiz ? (
        <>
          <h3>Edit Quiz</h3>
          <input
            type="text"
            placeholder="Quiz Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Main Question"
            value={mainQuestion}
            onChange={(e) => setMainQuestion(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ONGOING">Ongoing</option>
            <option value="UPCOMING">Upcoming</option>
          </select>
          <button onClick={handleUpdateQuiz}>Update Quiz</button>
          <div className="options">
            <h4>Options</h4>
            {quiz.options.map((option, optionIndex) => (
              <div key={optionIndex} className="option-item">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                />
                <button onClick={() => removeOption(optionIndex)}>Remove</button>
              </div>
            ))}
            <button onClick={addOption}>Add Option</button>
          </div>
          <div className="image-upload">
            <h4>Upload New Images</h4>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUploadImages}>Upload Images</button>
          </div>
          <div className="example-upload">
            <h4>Upload New Examples</h4>
            <input
              type="text"
              placeholder="Example Description"
              value={newExampleDescription}
              onChange={(e) => setNewExampleDescription(e.target.value)}
            />
            <input type="file" multiple onChange={handleExampleFileChange} />
            <button onClick={handleUploadExamples}>Upload Examples</button>
          </div>
          <div className="examples">
            <h4>Examples</h4>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quiz.examples.map((example) => (
                  <tr key={example._id}>
                    <td>{example.description}</td>
                    <td>
                      <button onClick={() => handleRemoveExample(example._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
};

export default EditQuiz;
