import React, { useState, useEffect } from 'react';
import CadastrarAssociado from '../../componentes/CadastrarAssociado/CadastrarAssociado';
import { useStyles } from './estilo.js';
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
  LinearProgress,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ServicoAssociado from '../../servicos/ServicoAssociado';

const Associados = () => {
  const [loading, setLoading] = useState(false);
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
    try {
      setLoading(true);
      const associados = await ServicoAssociado.obterAssociados({
        _start: qtdeInicial, _end: qtdeFinal
      });
  
      setAssociados(associados);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    paginacao();
  }, []);

  async function onChangePage(event, nextPage) {
    event.preventDefault();
    setPage(nextPage);
  }

  async function onChangeRowsPerPage(event) {
    event.preventDefault();
    setRowsPerPage(event.target.value);
  }
  const classes = useStyles();

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

      {!loading && <div className={classes.mockProgressBar} />}
      <TableContainer component={Paper}>
        {loading && <LinearProgress />}
        {loading && <div className={classes.tableLoading} />}
        <Table className={classes.table}>
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
            {associados.map(associado => (
              <TableRow key={associado._id}>
                <TableCell>
                  <span>{associado.nome}</span>
                </TableCell>
                <TableCell>
                  <span>{associado.sobrenome}</span>
                </TableCell>
                <TableCell>
                  <span>{associado.cpf}</span>
                </TableCell>
                <TableCell>
                  <span>{associado.email}</span>
                </TableCell>
                <TableCell>
                  {associado.tel_celular && <span>{associado.tel_celular.numero}</span>}
                </TableCell>
                <TableCell>
                  {associado.tel_celular && <span>{associado.tel_celular.whatsapp}</span>}
                </TableCell>
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

export default Associados;
