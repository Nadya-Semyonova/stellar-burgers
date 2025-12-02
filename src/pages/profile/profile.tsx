import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser, logoutUser } from '../../services/slices/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Обновляем форму при изменении данных пользователя
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // Проверяем, были ли изменены данные формы
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) return;

    // Подготавливаем данные для обновления
    const updateData: { name: string; email: string; password?: string } = {
      name: formValue.name,
      email: formValue.email
    };

    // Добавляем пароль только если он был изменен
    if (formValue.password) {
      updateData.password = formValue.password;
    }

    // Отправляем запрос на обновление данных
    dispatch(updateUser(updateData))
      .unwrap()
      .then(() => {
        // После успешного обновления очищаем поле пароля
        setFormValue((prev) => ({
          ...prev,
          password: ''
        }));
      })
      .catch((error) => {
        console.error('Failed to update user:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Сбрасываем форму к исходным данным пользователя
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  // Функция выхода
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || ''}
      onLogout={handleLogout}
    />
  );
};
