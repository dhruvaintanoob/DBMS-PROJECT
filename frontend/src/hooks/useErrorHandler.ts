import { useState, useCallback } from 'react';
import { ApiError } from '../types';

export const useErrorHandler = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn();
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.message || err.message || 'An error occurred',
        status: err.response?.status || 500,
        code: err.response?.data?.code
      };
      setError(apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, isLoading, handleAsync, clearError };
};