export default {
  loadAssociados: (state, action) => {
    state.associados = action.payload;
  },
  createAssociado: (state, action) => {
    const associados = [...state.associados];

    associados.push(action.payload);
    state.associados = associados;
  },
  updateAssociado: (state, action) => {
    const associados = [...state.associados];
    const index = associados.findIndex(associado => associado._id === action.payload._id);

    if (index < 0) {
      return;
    }

    associados.splice(index, 1, action.payload);
    state.associados = associados;
  },
  removeAssociado: (state, action) => {
    const associados = [...state.associados];
    const index = associados.findIndex(associado => associado._id === action.payload._id);

    if (index < 0) {
      return;
    }

    associados.splice(index, 1);
    state.associados = associados;
  },
  setLoading: (state, action) => {
    state.loading = action.payload;
  },
};
