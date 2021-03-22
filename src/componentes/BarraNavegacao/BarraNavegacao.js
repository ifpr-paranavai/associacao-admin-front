
import './estilo.css';
import React, { Component } from 'react';
import {Navbar} from 'react-bootstrap';


class BarraNavegacao extends Component{
  render(){
    return (
      <Navbar bg="primary">
        <Navbar.Brand href="#home">Área Administrativa</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Rafaela</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>    
    )

  }
}

export default BarraNavegacao;
