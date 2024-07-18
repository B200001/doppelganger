import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAdmin } from '../store/adminSlice';

const useRouteChange = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname;
    if (!currentPath.startsWith('/admin')) {
      dispatch(clearAdmin());
      localStorage.removeItem('adminToken');
    }
  }, [location, dispatch]);
};

export default useRouteChange;
