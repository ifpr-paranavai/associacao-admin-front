import React, { Component, useState, useEffect } from 'react';
import { useStyles }  from './estilo.js';
import{
      Paper, Container, TableContainer, Table, TableBody, TableHead, TableRow, TableCell
} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
import axios from 'axios';



class Associados extends Component{
      render(){  
            const {classes} = this.props;
            const [users, setUsers] = useStates([]);
            const loadUsers = async () => {
                  const res = await axios.get("https://whispering-plains-13580.herokuapp.com/");
                  setUsers(res.data);
            };

            useEffect(() => {
                  loadUsers()
            }, []);

            return(
                  <Container className={classes.root}>
                        <TableContainer component = {Paper}>
                              <Table>
                                    <TableHead>
                                          <TableRow>
                                                <TableCell>Nome</TableCell>
                                                <TableCell>Sobrenome</TableCell>
                                                <TableCell>CPF</TableCell>
                                                <TableCell>E-mail</TableCell>
                                                <TableCell>Celular</TableCell>
                                                <TableCell>WhatsApp</TableCell>
                                          </TableRow>
                                    </TableHead>
                                    <TableBody>
                                          {users.map((user) =>(
                                                <TableRow>
                                                      <TableCell>{user.nome}</TableCell>
                                                      <TableCell>{user.sobrenome}</TableCell>
                                                      <TableCell>{user.cpf}</TableCell>
                                                      <TableCell>{user.email}</TableCell>
                                                      <TableCell>{user.tel_celular.numero}</TableCell>
                                                      <TableCell>{user.tel_celular.whatsapp}</TableCell>
                                                </TableRow>
                                                
                                          ))}
                                    </TableBody>
                              </Table>
                        </TableContainer>
                  </Container>
            )

            
      }
}

export default withStyles(useStyles) (Associados);
      