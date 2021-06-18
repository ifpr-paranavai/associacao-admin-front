import React, { useEffect, useState  } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import BarraNavegacao from './componentes/BarraNavegacao/BarraNavegacao';
import PaginaLogin from './componentes/PaginaLogin/PaginaLogin';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ptBR } from '@material-ui/core/locale';

import { NotificationProvider } from './contextos/Notificacao';
import { NavigationProvider } from './contextos/Navegacao';

import ServicoAutenticacao from './servicos/ServicoAutenticacao';
import { parseJWT } from './uteis/string';

const App = () => {
  // Nova forma de definir a state [valor, função que atualiza o valor] = useState('valor inicial')
  const [logadoLocalmente, setLogadoLocalmente] = useState(false);
  const [timer, setTimer] = useState(null);
  const Servico = new ServicoAutenticacao();

  // Substituto do componentWillMount / componentDidMount / componentDidUpdate
  useEffect(() => {
    const associado = Servico.obterAssociadoLogado();
    
    validarToken()
    setTimer(setInterval(() => validarToken(), 60 * 5000))

    if (associado?.id) {
      // Atualiza a state(logadoLocalmente) para true
      setLogadoLocalmente(true);
      return () => { setTimer(null) }
    }
    // Atualiza a state(logadoLocalmente) para falso
    setLogadoLocalmente(false);
    return () => { setTimer(null) }
  }, []);

  function validarToken () {
    const token = localStorage.getItem('associadoToken');
    if (!token) {
      return;
    }
    const decodedToken = parseJWT(token);
    if (decodedToken.exp < (Date.now() / 1000)) {
      setLogadoLocalmente(false);
      Servico.removerAssociadoLocalStorage()
    }
  }

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
      <NavigationProvider>
        <NotificationProvider>
          {
            // Operador ternário, se logadoLocalmente mostra usuarioLogado, caso contrário mostra usuarioNaoLogado
            logadoLocalmente ? usuarioLogado() : usuarioNaoLogado()
          }
        </NotificationProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
