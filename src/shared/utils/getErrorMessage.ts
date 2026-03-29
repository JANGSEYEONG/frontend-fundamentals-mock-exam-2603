import axios from 'axios';

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return null;
};
