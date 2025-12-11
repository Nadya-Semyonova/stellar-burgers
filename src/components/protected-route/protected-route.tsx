import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/authSlice';
import { getCookie } from '../../utils/cookie';

interface ProtectedRouteProps {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (
      (localStorage.getItem('accessToken') || getCookie('accessToken')) &&
      !user
    ) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  // Если роут только для неавторизованных и пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Если роут защищенный и пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
