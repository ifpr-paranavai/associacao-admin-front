import { AutenticacaoType } from './types';

const INITIAL_STATE = {
  loggedUser: null,
  loading: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AutenticacaoType.AUTH:
      return { ...state, loading: true };
    case AutenticacaoType.SET_LOGGED_USER:
      return { ...state, loggedUser: action.payload.user, loading: false };
    case AutenticacaoType.REMOVE_LOGGED_USER:
      return { ...state, loggedUser: null, loading: false };
    case AutenticacaoType.SET_LOADING:
      return { ...state, loading: action.payload.loading };
    default:
      return INITIAL_STATE;
  }
};

export default reducer;
