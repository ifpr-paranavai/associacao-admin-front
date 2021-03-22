import BarraNavegacao from './componentes/BarraNavegacao/BarraNavegacao'
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch }  from 'react-router-dom';
import './App.css';

class App extends Component{
  render(){
    return (
      <div>
        <BarraNavegacao />
        <Router>
          <Switch>
            <Route exact path="/"  />
            <Route path="/eventos" />
            <Route path="/associar" />
            <Route path="/classificados" />
            <Route path="/fotosvideos" />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;