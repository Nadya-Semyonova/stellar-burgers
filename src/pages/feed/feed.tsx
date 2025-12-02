import { FeedUI } from '@ui-pages';
import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeedOrders } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.feed);

  // Функция для обновления ленты заказов
  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  // Показываем прелоадер во время загрузки
  if (loading) {
    return <Preloader />;
  }

  // Если есть ошибка
  if (error) {
    return (
      <div>
        <h1>Ошибка загрузки ленты заказов</h1>
        <p>{error}</p>
        <button onClick={handleGetFeeds}>Повторить попытку</button>
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
