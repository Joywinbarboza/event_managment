// utils/error.js
export const errorHandler = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
  };
  