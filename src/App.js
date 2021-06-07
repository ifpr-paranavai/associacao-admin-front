import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import BarraNavegacao from './componentes/BarraNavegacao/BarraNavegacao';
import PaginaLogin from './componentes/PaginaLogin/PaginaLogin';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ptBR } from '@material-ui/core/locale';

import { NotificationProvider } from './contextos/Notificacao';

import ServicoAutenticacao from './servicos/ServicoAutenticacao';

const App = () => {
  // Nova forma de definir a state [valor, função que atualiza o valor] = useState('valor inicial')
  const [logadoLocalmente, setLogadoLocalmente] = useState(false);

  // Substituto do componentWillMount / componentDidMount / componentDidUpdate
  useEffect(() => {
    const Servico = new ServicoAutenticacao();
    const associado = Servico.obterAssociadoLogado();

    if (associado && associado.id) {
      // Atualiza a state(logadoLocalmente) para true
      setLogadoLocalmente(true);
      return
    }
    // Atualiza a state(logadoLocalmente) para falso
    setLogadoLocalmente(false);
  }, []);

  const usuarioLogado = () => {
    return (
      <div>
        <Router>
          <BarraNavegacao
            onLogout={() => setLogadoLocalmente(false)}
          />
        </Router>
      </div>
    );
  }

  const usuarioNaoLogado = () => {
    return <PaginaLogin />;
  }

  // Definição do tema e linguagem padrão
  const theme = createMuiTheme({
    palette: {
      primary: { main: '#1976d2' },
    },
  }, ptBR);

  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        {
          // Operador ternário, se logadoLocalmente mostra usuarioLogado, caso contrário mostra usuarioNaoLogado
          logadoLocalmente ? usuarioLogado() : usuarioNaoLogado()
        }
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
