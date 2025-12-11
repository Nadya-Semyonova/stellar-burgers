import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items: ingredients, loading } = useSelector(
    (state) => state.ingredients
  );

  // Находим ингредиент по ID из URL
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  // Показываем прелоадер во время загрузки ингредиентов
  if (loading) {
    return <Preloader />;
  }

  // Если ингредиент не найден после загрузки
  if (!ingredientData) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p className='text text_type_main-medium'>Ингредиент не найден</p>
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
