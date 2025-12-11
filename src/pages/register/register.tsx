import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: serverError } = useSelector((state) => state.auth);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLocalError('');

    // Проверяем, что все поля заполнены
    if (!userName || !email || !password) {
      setLocalError('Пожалуйста, заполните все поля');
      return;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Введите корректный email');
      return;
    }

    // Валидация пароля
    if (password.length < 6) {
      setLocalError('Пароль должен содержать минимум 6 символов');
      return;
    }

    dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    )
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        if (
          error.message?.includes('403') ||
          error.message?.includes('запрещен')
        ) {
          setLocalError(
            'Доступ запрещен. Возможно, пользователь с таким email уже существует.'
          );
        } else if (error.message?.includes('400')) {
          setLocalError('Некорректные данные. Проверьте правильность ввода.');
        } else {
          setLocalError('Ошибка регистрации. Попробуйте позже.');
        }
      });
  };

  // Объединяем локальные ошибки и ошибки из стора
  const errorText = localError || serverError || '';

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
