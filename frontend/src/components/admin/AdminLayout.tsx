import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { RootState } from '../store';
import { clearAdmin } from '../../store/adminSlice';
import useRouteChange from '../../hooks/useRouteChange';
import './styles/AdminDashboard.scss';

const AdminLayout:React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const admin = useSelector((state: RootState) => state.admin);

  useRouteChange();

  useEffect(() => {
    // Clear admin state and token when the component mounts
    if (window.location.pathname === '/admin/login') {
      dispatch(clearAdmin());
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminUsername');
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(clearAdmin());
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  // const handleUsersClick = () => {
  //   navigate('/admin/users');
  // };

  // const handleAnsweredQuestionsClick = () => {
  //   navigate('/admin/answered-questions');
  // };

  return (
    <div className="admin-dashboard">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {/* {admin.username && <p className="admin-welcome">Welcome, {admin.username}!</p>} */}

      {/* <div className="sections">
        <div className="section">
          <h3>Users</h3>
          <p onClick={handleUsersClick} className="user-count">
            Total Users
          </p>
        </div>
        <div className="section">
          <h3>Answered Questions</h3>
          <p onClick={handleAnsweredQuestionsClick} className="answered-questions-count">
            Total Answered Questions
          </p>
        </div>
        <div className="section">
          <h3>Add a Question</h3>
          <button onClick={() => navigate('/admin/dashboard/question')}>
            ADD QUESTIONS
          </button>
        </div>

        <div className="section">
          <h3>Navigation</h3>
          <button onClick={() => navigate('/admin/answers')}>All Answers</button>
          <button onClick={() => navigate('/admin/feedback')}>Feedback</button>
          <button onClick={() => navigate('/admin/questions')}>Questions</button>
          <button onClick={() => navigate('/admin/registrations')}>Registrations</button>
        </div>
      </div> */}

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
