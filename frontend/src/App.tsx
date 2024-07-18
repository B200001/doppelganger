import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { setUser, clearUser } from './store/userSlice';
import { setAdmin, clearAdmin } from './store/adminSlice';
import Header from './components/Header';
import './styles/global.scss';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./Pages/Home'));
const About = lazy(() => import('./Pages/About'));
const Project = lazy(() => import('./Pages/Project'));
const GetStarted = lazy(() => import('./Pages/GetStarted'));
const Register = lazy(() => import('./Pages/Register'));
const Login = lazy(() => import('./Pages/Login'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const QuizPage = lazy(() => import('./Pages/QuizPage'));
const ResultPage = lazy(() => import('./Pages/ResultPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const UserProfile = lazy(() => import('./Pages/UserProfile'));
const Participate = lazy(() => import('./Pages/Participate'));
const UsersPage = lazy(() => import('./components/admin/UsersPage'));
const UserDetail = lazy(() => import('./components/admin/UserDetail'));
const AnsweredQuestionsPage = lazy(() => import('./components/admin/AnsweredQuestionsPage'));
const AnswerDetailPage = lazy(() => import('./components/admin/AnswerDetailsPage'));
const QuestionAnswerCounts = lazy(() => import('./components/admin/QuestionAnswerCounts'));
const RemovedImages = lazy(() => import('./components/admin/RemovedImages'));
const ManageQuizzes = lazy(() => import('./components/admin/ManageQuizzes'));
const EditQuiz = lazy(() => import('./components/admin/EditQuiz'));
const Certificate = lazy(() => import('./Pages/Certificate'));

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const adminToken = localStorage.getItem('adminToken');
    const adminId = localStorage.getItem('adminId');
    const adminUsername = localStorage.getItem('adminUsername');

    if (token && userEmail) {
      dispatch(setUser({ token, user: { email: userEmail, name: '' } }));
    } else {
      dispatch(clearUser());
    }

    if (adminToken && adminId && adminUsername) {
      dispatch(setAdmin({ token: adminToken, adminId, username: adminUsername }));
    } else {
      dispatch(clearAdmin());
    }
  }, [dispatch]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = localStorage.getItem('adminToken');
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  const ProtectedRoute2 = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
      {!isAdminRoute && <Header />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/resources" element={<GetStarted />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/profile" element={<ProtectedRoute2><UserProfile /></ProtectedRoute2>} />
          <Route path="/participate" element={<ProtectedRoute2><Participate /></ProtectedRoute2>} />
          <Route path="/certificate" element={<ProtectedRoute2><Certificate /></ProtectedRoute2>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:userId" element={<UserDetail />} />
            <Route path="answered-questions" element={<AnsweredQuestionsPage />} />
            <Route path="answers/:answerId" element={<AnswerDetailPage />} />
            <Route path="question-answer-counts" element={<QuestionAnswerCounts />} />
            <Route path="manage-quizzes" element={<ManageQuizzes />} />
            <Route path="manage-quizzes/:quizId" element={<EditQuiz />} />
            <Route path="removed-images" element={<RemovedImages />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} /> {/* Handle undefined routes */}
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
