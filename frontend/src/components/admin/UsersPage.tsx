import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './styles/UsersPage.scss';

interface User {
  _id: string;
  username: string;
  email: string;
  user: number;
  answerCount: number;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const token = useSelector((state: RootState) => state.admin.token);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchUsers = async (page: number, search: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/users?page=${page}&limit=10&search=${search}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch users', errorData);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchUsers(page, searchTerm);
  }, [page, searchTerm, token]);

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleSortByAnswers = () => {
    const sorted = [...users].sort((a, b) => b.answerCount - a.answerCount);
    setUsers(sorted);
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
    <div className="users-page">
      <h2>All Users</h2>
      <input
        type="text"
        placeholder="Search by username or user number"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-box"
      />
      <button onClick={handleSortByAnswers} className="sort-button">
        Sort by Answers Submitted
      </button>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => handleUserClick(user._id)}>
            <div className="user-info">
              <span>{user.username}</span>
              <span>{user.email}</span>
              <span>User Number: {user.user}</span>
            </div>
            <div className="answer-count">
              Answers: {user.answerCount}
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
