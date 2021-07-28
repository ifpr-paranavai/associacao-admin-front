import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
import reducers from './reducers';

const autenticacaoSlice = createSlice({
  name: 'autenticacao',
  initialState,
  reducers,
});

export const { setLoggedUser, removeLoggedUser, setLoading } = autenticacaoSlice.actions;
export default autenticacaoSlice.reducer;
