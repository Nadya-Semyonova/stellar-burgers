import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';

interface ProfileMenuProps {
  onLogout: () => void;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({ onLogout }) => {
  const { pathname } = useLocation();

  return <ProfileMenuUI handleLogout={onLogout} pathname={pathname} />;
};
