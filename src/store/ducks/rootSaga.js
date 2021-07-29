import { all, takeLatest } from 'redux-saga/effects';

import { AutenticacaoType } from './autenticacao/types';
import { auth } from './autenticacao/sagas';

export default function* rootSaga() {
  return yield all([takeLatest(AutenticacaoType.AUTH, auth)]);
}
