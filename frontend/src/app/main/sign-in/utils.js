import { AUTH_ERROR_CODES } from '../../constants/auth';

export const getErrorMessage = (error) => {
  if (error?.response?.status === 500) {
    return 'Server error';
  }

  return AUTH_ERROR_CODES[error?.response?.data?.detail] || 'Error while signing in';
};
