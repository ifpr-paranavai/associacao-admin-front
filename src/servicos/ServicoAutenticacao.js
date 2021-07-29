import API from '../Api';

const md5 = require('md5');

export default class ServicoAutenticacao {
  // --------------------------AUTH--------------------------//
  async logar({ email, senha }) {
    const response = await API.post('login', {
      email: email.toLowerCase(),
      senha: md5(senha),
    });
    this.salvarAssociadoToken(response.data);
    return response.data;
  } // login()

  salvarAssociadoToken(associado) {
    localStorage.setItem('associadoToken', associado.token);
  } // salvarAssociadoToken

  removerAssociadoLocalStorage() {
    localStorage.removeItem('associadoToken');
  } // removerAssociadoLocalStorage

  obterAssociadoLogado() {
    return JSON.parse(localStorage.getItem('associadoLogado'));
  } // obterAssociadoLogado()
}
