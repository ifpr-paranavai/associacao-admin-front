export default {
  setLoggedUser: (state, action) => {
    state.loggedUser = action.payload;
  },
  removeLoggedUser: state => {
    state.loggedUser = null;
  },
  setLoading: (state, action) => {
    state.loading = action.payload;
  },
};
