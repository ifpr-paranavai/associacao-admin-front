import BarraNavegacao from './componentes/BarraNavegacao/BarraNavegacao';
import PaginaLogin from './componentes/PaginaLogin/PaginaLogin';
import React, { Component } from 'react';
import { BrowserRouter as Router}  from 'react-router-dom';
import './App.css';

class App extends Component{
  usuarioLogado(){
    return (
      <div>
        <Router>
          <BarraNavegacao />
        </Router>
      </div>
    );
  }
  usuarioNaoLogado(){
    return(
        <PaginaLogin/>
    )
  }
  render(){
    let usuario= true;
    if(usuario){
      return this.usuarioLogado()
    }
    return this.usuarioNaoLogado()
   }
}

export default App;