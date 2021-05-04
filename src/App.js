import BarraNavegacao from "./componentes/BarraNavegacao/BarraNavegacao";
import PaginaLogin from "./componentes/PaginaLogin/PaginaLogin";
import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import ServicoAutenticacao from "./servicos/ServicoAutenticacao";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logadoLocalmente: false,
    };
  }
  componentWillMount() {
    let associado = ServicoAutenticacao.obterAssociadoLogado();

    if (associado && associado.id) {
      console.log(associado);
      this.state.logadoLocalmente = true;
    } else {
      this.state.logadoLocalmente = false;
    }
  }
  async sair() {
    await ServicoAutenticacao.removerAssociadoLocalStorage();
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
