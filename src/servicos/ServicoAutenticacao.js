import API from "../Api";


const md5 = require("md5");

export default class ServicoAutenticacao {
  //--------------------------AUTH--------------------------//
  async logar({ email, senha}) {
    try {
      console.log(email + senha);
      let response = await API.post("login", {
        email: email.toLowerCase(),
        senha: md5(senha),
      });
      await this.salvarAssociadoLocalStorage(response.data);
      return response.logar;
    } catch (error) {
        throw error;
    }
  } // login()

  salvarAssociadoLocalStorage(associado) {
    localStorage.setItem("associadoLogado", JSON.stringify(associado));
    localStorage.setItem("associadoToken", associado.token);

  } //removerAssociadoLocalStorage
  removerAssociadoLocalStorage() {
    localStorage.removeItem("associadoLogado");
    localStorage.removeItem("associadoToken");
  } //removerAssociadoLocalStorage

  obterAssociadoLogado() {
    return JSON.parse(localStorage.getItem("associadoLogado"));
  } // obterAssociadoLogado()
}
