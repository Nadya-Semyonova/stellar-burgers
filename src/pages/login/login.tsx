import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLocalError('');

    // Проверяем, что поля заполнены
    if (!email || !password) {
      setLocalError('Пожалуйста, заполните все поля');
      return;
    }

    // Простая валидация email
    if (!email.includes('@')) {
      setLocalError('Введите корректный email');
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from || '/';
        navigate(from);
      })
      .catch((error) => {
        // Конвертируем ошибку в читаемый формат
        if (
          error.message?.includes('401') ||
          error.message?.includes('email')
        ) {
          setLocalError('Неверный email или пароль');
        } else {
          setLocalError('Ошибка при входе. Попробуйте позже.');
        }
      });
  };

  // Объединяем локальные ошибки и ошибки из стора
  const errorText = localError || error || '';

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
