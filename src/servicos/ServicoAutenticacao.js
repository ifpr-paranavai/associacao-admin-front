import API from '../Api';

const md5 = require('md5');

export default class ServicoAutenticacao {
  async logar({ email, senha }) {
    try {
      const response = await API.post('login', {
        email: email.toLowerCase(),
        senha: md5(senha),
      });

      this.salvarAssociadoLocalStorage(response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 500) {
        throw new Error(error.response.data);
      } else {
        throw new Error('Ocorreu um erro, tente novamente mais tarde!');
      }
    }
  }

  salvarAssociadoLocalStorage(associado) {
    localStorage.setItem('associadoLogado', JSON.stringify(associado));
    localStorage.setItem('associadoToken', associado.token);
  } // removerAssociadoLocalStorage

  removerAssociadoLocalStorage() {
    localStorage.removeItem('associadoLogado');
    localStorage.removeItem('associadoToken');
  } // removerAssociadoLocalStorage

  obterAssociadoLogado() {
    return JSON.parse(localStorage.getItem('associadoLogado'));
  } // obterAssociadoLogado()
}
