import API from '../Api';

const md5 = require('md5');

export default class ServicoAutenticacao {
  //--------------------------AUTH--------------------------//
  async logar({ email, senha }) {
    console.log(email + senha);
    const response = await API.post('login', {
      email: email.toLowerCase(),
      senha: md5(senha),
    });
    this.salvarAssociadoLocalStorage(response.data);
    return response.logar;
  } // login()

  salvarAssociadoLocalStorage(associado) {
    localStorage.setItem('associadoLogado', JSON.stringify(associado));
    localStorage.setItem('associadoToken', associado.token);

  } //removerAssociadoLocalStorage
  removerAssociadoLocalStorage() {
    localStorage.removeItem('associadoLogado');
    localStorage.removeItem('associadoToken');
  } //removerAssociadoLocalStorage

  obterAssociadoLogado() {
    return JSON.parse(localStorage.getItem('associadoLogado'));
  } // obterAssociadoLogado()
}
