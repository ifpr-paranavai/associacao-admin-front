import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
import reducers from './reducers';

const associadosSlice = createSlice({
  name: 'associados',
  initialState,
  reducers,
});

export const {
  loadAssociados,
  createAssociado,
  updateAssociado,
  removeAssociado,
  setLoading,
} = associadosSlice.actions;

export default associadosSlice.reducer;
