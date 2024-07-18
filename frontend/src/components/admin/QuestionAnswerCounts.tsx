import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import LoadingSpinner from '../LoadingSpinner';
import './styles/QuestionAnswerCounts.scss';

interface AnswerCount {
  _id: string;
  count: number;
  image_name: string;
}

const QuestionAnswerCounts:React.FC = () => {
  const token = useSelector((state: RootState) => state.admin.token);
  const [answerCounts, setAnswerCounts] = useState<AnswerCount[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnsweredQuestions, setTotalAnsweredQuestions] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAnswerCounts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/admin/answer-counts?page=${page}&limit=100&filter=${filter}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAnswerCounts(data.answerCounts);
          setTotalPages(data.totalPages);
          setTotalAnsweredQuestions(data.totalAnsweredQuestions);
        } else {
          console.error('Failed to fetch answer counts');
        }
      } catch (error) {
        console.error('Failed to fetch answer counts', error);
        console.log(totalAnsweredQuestions);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswerCounts();
  }, [token, page, filter]);

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div className="question-answer-counts">
      <h3>Question Answer Counts</h3>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by image name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image Name</th>
              <th>Answer Count</th>
            </tr>
          </thead>
          <tbody>
            {answerCounts.map((count) => (
              <tr key={count._id}>
                <td>{count._id}</td>
                <td>{count.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionAnswerCounts;
