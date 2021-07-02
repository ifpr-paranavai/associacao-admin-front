import React, { createContext, useState, useContext } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export const NotificationContext = createContext({
  showError: () => {},
  showSuccess: () => {},
  showWarning: () => {},
  showInfo: () => {},
});

export const useNotify = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('error');
  const [message, setMessage] = useState('');

  function openWithMessage(message) {
    setMessage(message);
    setOpen(true);
  }

  function showError(message) {
    openWithMessage(message);
    setType('error');
  }

  function showSuccess(message) {
    openWithMessage(message);
    setType('success');
  }

  function showWarning(message) {
    openWithMessage(message);
    setType('warning');
  }

  function showInfo(message) {
    openWithMessage(message);
    setType('info');
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setMessage('');
      setType('error');
    }, 100);
  }

  const value = {
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      <Snackbar open={open} autoHideDuration={2800} onClose={handleClose}>
        <Alert variant="filled" severity={type} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  );
};
