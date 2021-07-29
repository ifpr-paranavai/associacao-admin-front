import { action } from 'typesafe-actions';
import { AutenticacaoType } from './types';

export const auth = data => action(AutenticacaoType.AUTH, data);

export const setLoggedUser = user => action(AutenticacaoType.SET_LOGGED_USER, { user });

export const removeLoggedUser = () => action(AutenticacaoType.REMOVE_LOGGED_USER);

export const setLoading = loading => action(AutenticacaoType.SET_LOADING, { loading });
