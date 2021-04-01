import BarraNavegacao from './componentes/BarraNavegacao/BarraNavegacao'
import React, { Component } from 'react';
import { BrowserRouter as Router}  from 'react-router-dom';
import './App.css';

class App extends Component{
  render(){
    return (
      <div>
        <Router>
          <BarraNavegacao />
        </Router>
      </div>
    );
  }
}

export default App;