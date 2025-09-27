import { useAuthData } from '@/modules/auth/service/AuthService.hooks';

export const useAuth = () => {
  const { user } = useAuthData();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
