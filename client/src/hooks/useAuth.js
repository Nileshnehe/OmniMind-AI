import { useSelector, useDispatch } from 'react-redux';
import { loginUserThunk,registerUserThunk,clearAuthErrors,resetRegisterStatus } from '../store/slices/auth.slice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // Extract tracking points out from state store registry
  const { user, isAuthenticated, loading, error, registerSuccess } = useSelector((state) => state.auth);

  const login = (email, password) => {
    dispatch(loginUserThunk({ email, password }));
  };

  const register = (username, email, password) => {
    dispatch(registerUserThunk({ username, email, password }));
  };

  const clearErrors = () => {
    dispatch(clearAuthErrors());
  };

  const resetRegisterFlag = () => {
    dispatch(resetRegisterStatus());
  };

  return {
    user,
    isAuthenticated,
    loading, 
    error,   
    registerSuccess,
    login,
    register,
    clearErrors,
    resetRegisterFlag
  };
};