import { useSelector, useDispatch } from 'react-redux';
import { loginUserThunk, registerUserThunk, clearAuthErrors, resetRegisterStatus, getMeThunk, logoutUserThunk, sessionSkipped } from '../store/slices/auth.slice';
import { authServices } from '../features/auth/services/auth.api';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();

  // Extract tracking points out from state store registry
  const { user, isAuthenticated, loading, error, registerSuccess, isCheckingSession } = useSelector((state) => state.auth);

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

  const checkSession = useCallback(async () => {
    const result = await dispatch(getMeThunk());
    // If the thunk was aborted because no token exists (condition returned false),
    // result.meta.condition will be false — dispatch sessionSkipped to unblock routes.
    if (result.meta?.condition === false) {
      dispatch(sessionSkipped());
    }
  }, [dispatch]);

  const logout = useCallback(() => {
  dispatch(logoutUserThunk());
}, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    registerSuccess,
    isCheckingSession,
    login,
    register,
    clearErrors,
    resetRegisterFlag,
    checkSession,
    logout
  };
};