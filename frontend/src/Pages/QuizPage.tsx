import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import '../styles/QuizPage.scss';
import LoadingSpinner from '../components/LoadingSpinner';

interface Question {
  _id: string;
  question_image: string;
  question_slug: string;
  is_answered: boolean;
}

interface Example {
  example_image: string;
  description: string;
}

interface Option {
  text: string;
}

interface Quiz {
  _id: string;
  title: string;
  mainQuestion: string;
  questions: Question[];
  options: Option[];
  examples: Example[];
}

interface Answer {
  [key: string]: { [option: string]: boolean };
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const currentUser = useSelector((state: RootState) => state.user?.currentUser);
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [unlistedFeature, setUnlistedFeature] = useState('');
  const [showLines, setShowLines] = useState(false);
  const [middleCoordinates, setMiddleCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = currentUser?.token;

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchQuizData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/quizzes/${quizId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setQuizData(data);
        } else {
          console.error('Failed to fetch quiz data');
        }
      } catch (error) {
        console.error('Failed to fetch quiz data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [token, quizId, baseUrl]);

  const calculateMiddleCoordinates = () => {
    const imageElement = document.querySelector('.question-image');
    if (imageElement) {
      const { width, height } = imageElement.getBoundingClientRect();
      const middleX = width / 2;
      const middleY = height / 2;
      setMiddleCoordinates({ x: middleX, y: middleY });
    }
  };

  useEffect(() => {
    calculateMiddleCoordinates();
    window.addEventListener('resize', calculateMiddleCoordinates);

    return () => {
      window.removeEventListener('resize', calculateMiddleCoordinates);
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (middleCoordinates) {
      setShowLines(true);
      const timer = setTimeout(() => {
        setShowLines(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [middleCoordinates]);

  const handleOptionChange = (questionId: string, option: string, value: boolean) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [option]: value,
      },
    }));
    if (option === 'Do you see any feature not listed above' && value) {
      setUnlistedFeature('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !quizData) return;
    try {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      const answer = answers[currentQuestion._id];
      const response = await fetch(`${baseUrl}/api/quizzes/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: quizData._id,
          questionIndex: currentQuestionIndex,
          questionId: currentQuestion._id,
          answers: answer,
          email: currentUser.email,
          imageUrl: currentQuestion.question_image,
          unlistedFeature: answer['Do you see any feature not listed above'] ? unlistedFeature : 'None'
        }),
      });
      if (response.ok) {
        const updatedQuizData = { ...quizData };
        updatedQuizData.questions.splice(currentQuestionIndex, 1);
        setQuizData(updatedQuizData);
        if (currentQuestionIndex >= updatedQuizData.questions.length) {
          setCurrentQuestionIndex(0);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        navigate('/result');
      } else {
        console.error('Failed to submit answers');
      }
    } catch (error) {
      console.error('Failed to submit answers:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMiddleCoordinates(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setMiddleCoordinates(null);
    }
  };

  const toggleShowLines = () => {
    setShowLines(!showLines);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const currentQuestion = quizData?.questions[currentQuestionIndex];

  return (
    <div className="quiz-page">
      <h2 className="fade-in-down">{quizData?.title}</h2>
      <p>{quizData?.mainQuestion}</p>
      <div className='question-examples-container'>
        <div className='question-container'>
          <div className="button-overlay">
            <button onClick={toggleShowLines} className="show-lines-button">Show Lines</button>
            <button className="show-examples-button" onClick={() => setShowModal(true)}>Show Examples</button>
          </div>
          {currentQuestion ? (
            <form onSubmit={handleSubmit} className="fade-in">
              <div key={currentQuestion._id} className='question-answer'>
                <div className="image-container">
                  <img
                    src={`${baseUrl}/${currentQuestion.question_image}`}
                    alt="Quiz question"
                    className="question-image fade-in"
                    onError={(e) => console.log('Image failed to load:', e)}
                    onLoad={calculateMiddleCoordinates}
                  />
                  {showLines && middleCoordinates && (
                    <div className="overlay-lines">
                      <div className="horizontal-line" style={{ top: `${middleCoordinates.y}px` }}></div>
                      <div className="vertical-line" style={{ left: `${middleCoordinates.x}px` }}></div>
                    </div>
                  )}
                </div>
                <div className='question-options'>
                  {quizData?.options.map((option) => (
                    <div key={option.text} className="option fade-in-left">
                      <p>{option.text}</p>
                      <div className="option-buttons">
                        <label>
                          Yes
                          <input
                            type="radio"
                            name={`${currentQuestion._id}-${option.text}`}
                            checked={answers[currentQuestion._id]?.[option.text] === true}
                            onChange={() => handleOptionChange(currentQuestion._id, option.text, true)}
                          />
                        </label>
                        <label>
                          No
                          <input
                            type="radio"
                            name={`${currentQuestion._id}-${option.text}`}
                            checked={answers[currentQuestion._id]?.[option.text] === false}
                            onChange={() => handleOptionChange(currentQuestion._id, option.text, false)}
                          />
                        </label>
                      </div>
                      {option.text === 'Do you see any feature not listed above' && answers[currentQuestion._id]?.[option.text] && (
                        <input
                          type="text"
                          value={unlistedFeature}
                          onChange={(e) => setUnlistedFeature(e.target.value)}
                          placeholder="Describe the unlisted feature"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="navigation-buttons">
                <button type="button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                  Previous
                </button>
                <button type="button" onClick={handleNextQuestion} disabled={currentQuestionIndex === quizData.questions.length - 1}>
                  Next
                </button>
              </div>
              <button type="submit" className="submit-button">Submit</button>
            </form>
          ) : (
            <p>No more questions available.</p>
          )}
        </div>

        <div className='examples'>
          <div>
            <h5>Kindly match the <strong>features of these images</strong> to these example features and answer the questions.</h5>
          </div>
          {quizData?.examples.map(example => (
            <div key={example.example_image} className="feature-example">
              <img src={`${baseUrl}/${example.example_image}`} alt={example.description} />
              <p>{example.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setShowModal(false)}>Close</button>
            <div className='examples'>
              {quizData?.examples.map(example => (
                <div key={example.example_image} className="feature-example">
                  <img src={`${baseUrl}/${example.example_image}`} alt={example.description} />
                  <p>{example.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
