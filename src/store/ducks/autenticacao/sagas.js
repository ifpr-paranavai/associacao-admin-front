import { call, put } from 'redux-saga/effects';
import AutenticacaoService from '../../../servicos/ServicoAutenticacao';

import { setLoggedUser, setLoading } from './actions';

export function* auth(action) {
  try {
    const servico = new AutenticacaoService();
    const user = yield call(servico.logar, action.payload);

    yield put(setLoggedUser(user));
  } catch (error) {
    throw new Error(error);
  } finally {
    yield put(setLoading(false));
  }
}
