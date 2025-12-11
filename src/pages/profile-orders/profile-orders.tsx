import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { logoutUser } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector(
    (state) => state.profileOrders
  );

  // Загружаем заказы пользователя при монтировании компонента
  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);
  // Функция для выхода из аккаунта
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return <ProfileOrdersUI orders={orders} onLogout={handleLogout} />;
};
