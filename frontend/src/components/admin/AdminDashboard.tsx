import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AdminDashboard.scss';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleUsersClick = () => {
    navigate('/admin/users');
  };

  const handleAnsweredQuestionsClick = () => {
    navigate('/admin/answered-questions');
  };

  const handleManageQuizzesClick = () => {
    navigate('/admin/manage-quizzes');
  };

  const handleRemovedImagesClick = () => {
    navigate('/admin/removed-images');
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="sections">
        <div className="section" onClick={handleUsersClick}>
          <h3>Users</h3>
          <p className="description">View and manage all registered users.</p>
          <p className="user-count">Total Users</p>
        </div>
        <div className="section" onClick={handleAnsweredQuestionsClick}>
          <h3>Answered Questions</h3>
          <p className="description">View and manage all answered questions.</p>
          <p className="answered-questions-count">Total Answered Questions</p>
        </div>
        <div className="section" onClick={handleManageQuizzesClick}>
          <h3>Manage Quizzes</h3>
          <p className="description">Create, edit quizzes, and upload images.</p>
          <p className="manage-quizzes">Create, Edit, Upload Images</p>
        </div>
        <div className="section" onClick={handleRemovedImagesClick}>
          <h3>Removed Images</h3>
          <p className="description">View and manage removed images.</p>
          <p className="removed-images">View Removed Images</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
