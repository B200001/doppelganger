import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Papa from "papaparse"
import './styles/AnsweredQuestionsPage.scss';

interface Answer {
  _id: string;
  user: number;
  dataset: string;
  image_name: string;
  listed_ans: string[];
  unlisted_ans: string;
  question_slug: string;
  ans_time: string;
  username?: string;
}

const AnsweredQuestionsPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [filteredAnswers, setFilteredAnswers] = useState<Answer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const token = useSelector((state: RootState) => state.admin.token);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!token) {
        console.error('No token found');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/admin/answers?page=${page}&limit=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAnswers(data.answers);
          setFilteredAnswers(data.answers);
          setTotalPages(data.totalPages);
        } else {
          console.error('Failed to fetch answers', response.statusText);
          if (response.status === 401) {
            navigate('/admin/login');
          }
        }
      } catch (error) {
        console.error('Failed to fetch answers', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [token, navigate, page]);

  const handleAnswerClick = (answerId: string) => {
    navigate(`/admin/answers/${answerId}`);
  };

  const handleSearch = async () => {
    await searchAnswers(searchQuery, startDate, endDate);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const searchAnswers = async (query: string, startDate: string, endDate: string) => {
    if (!token) {
      console.error('No token found');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/admin/answers/search?query=${query}&startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFilteredAnswers(data);
      } else {
        console.error('Failed to search answers', response.statusText);
      }
    } catch (error) {
      console.error('Error searching answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setFilteredAnswers(answers);
  };

  const exportToCSV = async () => {
    setExporting(true);
    console.log('click, exporting');
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/answers/all/answers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      console.log(response);
  
      if (response.ok) {
        const data = await response.json();
        
        const csvData = data.map((answer: Answer) => ({
          User: `${answer.user}`, // Ensure this returns user info correctly
          Dataset: answer.dataset,
          'Image Name': answer.image_name,
          Answers: answer.listed_ans.join(', '),
          'Unlisted Answer': answer.unlisted_ans,
          'Question Slug': answer.question_slug,
          'Answered At': new Date(answer.ans_time).toLocaleString(),
        }));
  
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
        const date = new Date().toISOString().split('T')[0];
        const fileName = `Answers_${date}_${data.length}_answers.csv`;
  
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } else {
        console.error('Failed to fetch all answers', response.statusText);
      }
    } catch (error) {
      console.error('Error exporting answers:', error);
    } finally {
      setExporting(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="answered-questions-page">
      <h2>Answered Questions</h2>
      <button onClick={exportToCSV} className="export-button">
        Export to CSV
      </button>
      {exporting && <div className="loading-bar"><div className="progress"></div></div>}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by user no"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button onClick={clearFilters} className="clear-filters-button">
          Clear Filters
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Dataset</th>
            <th>Answered At</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnswers.map((answer) => (
            <tr key={answer._id} onClick={() => handleAnswerClick(answer._id)}>
              <td>{`${answer.user} (${answer.username})`}</td>
              <td>{answer.dataset}</td>
              <td>{answer.ans_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
      {loading && <div className="loading-bar"><div className="progress"></div></div>}
    </div>
  );
};

export default AnsweredQuestionsPage;
