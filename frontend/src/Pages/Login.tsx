import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { clearAdmin } from '../store/adminSlice';
import '../styles/Login.scss';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile'); // Redirect if already logged in
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const userData = await response.json();
        console.log(userData);

        localStorage.setItem('token', userData.token);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);

        dispatch(clearAdmin()); // Clear admin state

        dispatch(setUser({
          token: userData.token,
          user: {
            name: userData.name,
            email: userData.email,
          },
        }));

        navigate('/');
      } else {
        setError('Failed to log in. Please check your email and password.');
        console.error('Failed to log in');
      }
    } catch (error) {
      setError('Failed to log in. Please try again later.');
      console.error('Failed to log in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form fade-in">
        <h2 className="fade-in-down">Login</h2>
        {error && <p className="error fade-in">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group fade-in-left">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group fade-in-right">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary fade-in-up">Login</button>
        </form>
        <button
          className="btn btn-secondary fade-in-up"
          onClick={() => navigate('/register')}
        >
          New Here? Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
