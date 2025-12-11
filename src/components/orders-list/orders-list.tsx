import { FC, memo, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { TIngredient } from '@utils-types';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const { items: ingredients } = useSelector((state) => state.ingredients);

  // Создаем карту ингредиентов для быстрого поиска
  const ingredientsMap = useMemo(() => {
    const map: { [key: string]: TIngredient } = {};
    ingredients.forEach((ing: TIngredient) => {
      map[ing._id] = ing;
    });
    return map;
  }, [ingredients]);

  // Добавляем стоимость к каждому заказу
  const ordersWithPrice = useMemo(
    () =>
      orders.map((order) => {
        // Рассчитываем стоимость заказа
        let totalPrice = 0;

        if (order.ingredients && order.ingredients.length > 0) {
          order.ingredients.forEach((ingredientId: string) => {
            const ingredient = ingredientsMap[ingredientId];
            if (ingredient) {
              totalPrice += ingredient.price;
            }
          });
        }

        return {
          ...order,
          totalPrice
        };
      }),
    [orders, ingredientsMap]
  );

  // Сортируем по дате (новые первыми)
  const orderByDate = [...ordersWithPrice].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});
