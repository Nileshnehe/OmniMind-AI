import { useSelector, useDispatch } from 'react-redux';
import { loginUserThunk,registerUserThunk,clearAuthErrors,resetRegisterStatus } from '../store/slices/auth.slice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // Extract tracking points out from state store registry
  const { user, isAuthenticated, loading, error, registerSuccess } = useSelector((state) => state.auth);

  // const login = (email, password) => {
  //   dispatch(loginUserThunk({ email, password }));
  // };

  // const register = (username, email, password) => {
  //   dispatch(registerUserThunk({ username, email, password }));
  // };

  // const clearErrors = () => {
  //   dispatch(clearAuthErrors());
  // };

  // const resetRegisterFlag = () => {
  //   dispatch(resetRegisterStatus());
  // }; 

  

  const login = useCallback((email, password) => {
    dispatch(loginUserThunk({ email, password }));
  }, [dispatch]);

  const register = useCallback((username, email, password) => {
    dispatch(registerUserThunk({ username, email, password }));
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearAuthErrors());
  }, [dispatch]);

  const resetRegisterFlag = useCallback(() => {
    dispatch(resetRegisterStatus());
  }, [dispatch]);

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