import BarraNavegacao from "./componentes/BarraNavegacao/BarraNavegacao";
import PaginaLogin from "./componentes/PaginaLogin/PaginaLogin";
import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import ServicoAutenticacao from "./servicos/ServicoAutenticacao";
import API from './Api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logadoLocalmente: false,
    };
  }
  componentWillMount() {
    const Servico = new ServicoAutenticacao();
    let associado = Servico.obterAssociadoLogado();

    if (associado && associado.id) {
      API.defaults.headers['x-access-token'] = associado.token;
      console.log(associado);
      this.state.logadoLocalmente = true;
    } else {
      this.state.logadoLocalmente = false;
    }
  }
  async sair() {
    await ServicoAutenticacao.removerAssociadoLocalStorage();
    API.defaults.headers['x-access-token'] = '';

    // usando Redux (que é uma variável global), reinicializar a variável
  }
  usuarioLogado() {
    return (
      <div>
        <Router>
          <BarraNavegacao />
        </Router>
      </div>
    );
  }
  usuarioNaoLogado() {
    return <PaginaLogin />;
  }
  render() {
    let { logadoLocalmente } = this.state;
    if (logadoLocalmente) {
      return this.usuarioLogado();
    }
    return this.usuarioNaoLogado();
  }
}

export default App;
