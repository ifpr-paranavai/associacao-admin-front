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
    handleClose();
  }

  function showError(message) {
    openWithMessage(message);
    setType('error');
    handleClose();
  }

  function showSuccess(message) {
    openWithMessage(message);
    setType('success');
    handleClose();
  }

  function showWarning(message) {
    openWithMessage(message);
    setType('warning');
    handleClose();
  }

  function showInfo(message) {
    openWithMessage(message);
    setType('info');
    handleClose();
  }

  function handleClose() {
    setTimeout(() => {
      setOpen(false);
      setMessage('');
    }, 3000);
  }

  const value = {
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      <Snackbar open={open} autoHideDuration={2800}>
        <Alert variant="filled" severity={type}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  );
};
