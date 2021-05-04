import API from "../Api";

const md5 = require("md5");

export default class ServicoAutenticacao {
  //--------------------------AUTH--------------------------//
  static async logar({ email, senha }) {
    try {
      console.log(email + senha);
      let response = await API.post("login", {
        email: email.toLowerCase(),
        senha: md5(senha),
      });
      await this.salvarAssociadoLocalStorage(response.data);
      return response.logar;
    } catch (error) {
      throw error.response.logar;
    }
  } // login()

  static salvarAssociadoLocalStorage(associado) {
    localStorage.setItem("associadoLogado", JSON.stringify(associado));
  } //removerAssociadoLocalStorage
  static removerAssociadoLocalStorage() {
    localStorage.removeItem("associadoLogado");
  } //removerAssociadoLocalStorage

  static obterAssociadoLogado() {
    return JSON.parse(localStorage.getItem("associadoLogado"));
  } // obterAssociadoLogado()
}
