import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import associados from './associados';
import autenticacao from './autenticacao';

const store = configureStore({
  reducer: {
    associados,
    autenticacao,
  },
});

export const useAppDispatch = () => useDispatch();
export default store;
