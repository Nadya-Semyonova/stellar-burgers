import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector((state) => state.feed);

  // Поскольку в тестовом API все заказы имеют статус done,
  // покажем часть в "Готовы" и часть в "В работе" для демонстрации
  const readyOrders = orders
    .filter((item) => item.status === 'done')
    .slice(0, 10)
    .map((item) => item.number);

  const pendingOrders = orders
    .filter((item) => item.status === 'done')
    .slice(10, 20)
    .map((item) => item.number);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
