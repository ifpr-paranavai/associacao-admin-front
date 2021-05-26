import React, { useState, useEffect } from "react";
import CadastrarAssociado from "../../componentes/CadastrarAssociado/CadastrarAssociado";
import { useStyles } from "./estilo.js";
import {
  Paper,
  Container,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Button,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from "@material-ui/core/styles";
import ServicoAssociado from "../../servicos/ServicoAssociado";

const Associados = (props) => {
  const [associados, setAssociados]= useState([]);
  const [page, setPage]= useState(0);
  const [rowsPerPage, setRowsPerPage]= useState(10);
  const [qtdeInicial, setQtdeInicial]= useState(0);
  const [qtdeFinal, setQtdeFinal]= useState(10);
  const [open, setOpen] = useState(false);

  const abrirFormulario = () => {
    setOpen(true);
  };//abrir o dialogo

  const fecharFormulario = () => {
    setOpen(false);
  }; //fechar o dialogo

  async function paginacao() {
    let associados = await ServicoAssociado.obterAssociados({
      _start: qtdeInicial, _end: qtdeFinal
    });

    setAssociados(associados);
  }

  useEffect(async () => {
    await paginacao();
  }, []);

  async function onChangePage(event, nextPage) {
    event.preventDefault();
    setPage(nextPage);
  }

  async function onChangeRowsPerPage(event) {
    event.preventDefault();
    setRowsPerPage(event.target.value);
  }
  const { classes } = props;

  return (
    <Container className={classes.root}>
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={abrirFormulario}
        >
          Adicionar
        </Button>
      </div>
      <TableContainer component={Paper}>
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
            {associados
              .map((user) => (
                <TableRow key={user._id}>
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
        <TablePagination
          rowsPerPageOptions={[3, 10, 15, 25, 50]}
          count={associados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </TableContainer>
      <CadastrarAssociado
        open={open}
        fecharFormulario={fecharFormulario}

      />
    </Container>
  );

}

export default withStyles(useStyles)(Associados);
