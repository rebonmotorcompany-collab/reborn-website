import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setAuth, logout, setLoading, setError } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { RegisterPayload, LoginPayload } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const register = async (payload: RegisterPayload) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.register(payload);
      dispatch(setAuth(response));
      dispatch(setError(null));
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (payload: LoginPayload) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.login(payload);
      if (response.accessToken) {
        dispatch(setAuth(response));
      }
      dispatch(setError(null));
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    register,
    login,
    logout: handleLogout,
  };
};
