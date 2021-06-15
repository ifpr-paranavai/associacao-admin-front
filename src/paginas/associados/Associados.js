import React, { useState, useEffect } from 'react';
import {
  Paper,
  Avatar,
  IconButton,
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
  CircularProgress,
  colors,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputMask from 'react-input-mask';

import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { FaWhatsapp } from 'react-icons/fa'

import CadastrarAssociado from '../../componentes/CadastrarAssociado/CadastrarAssociado';
import ServicoAssociado from '../../servicos/ServicoAssociado';

import { useStyles } from './estilo.js';
import { useNotify } from '../../contextos/Notificacao';
import { removeMask } from '../../uteis/string';

const Associados = () => {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const notify = useNotify();
  
  const [associadoSelecionado, setAssociadoSelecionado]= useState(null);
  const [cpfConfirmacao, setCPFConfirmacao]= useState(null);
  const [associados, setAssociados]= useState([]);
  const [page, setPage]= useState(0);
  const [rowsPerPage, setRowsPerPage]= useState(10);
  const [_start, setStart]= useState(0);
  const [_end, setEnd]= useState(10);

  const abrirFormulario = () => {
    setOpen(true);
  };// abrir o dialogo

  const fecharFormulario = () => {
    setOpen(false);
    setAssociadoSelecionado(null);
  }; // fechar o dialogo

  async function paginacao() {
    try {
      setLoading(true);
      const associados = await ServicoAssociado.obterAssociados({ _start, _end });
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

  function onSaveAssociado () {
    paginacao();
    fecharFormulario();
  }

  function onOpenWhatsAppLink (phone) {
    const whatsappNumber = removeMask(phone);
    const whatsappLink = `https://api.whatsapp.com/send/?phone=${whatsappNumber}`;
    window.open(whatsappLink, '_blank');
  }

  async function handleRemoveAssociado () {
    if (cpfConfirmacao !== associadoSelecionado.cpf) {
      notify.showWarning('O CPF informado não corresponde ao do associado a ser removido!')
      return
    }
    try {
      setRemoving(true);
      await ServicoAssociado.deletarAssociado(associadoSelecionado._id);

      setDeleteDialog(false);
      setAssociadoSelecionado(null);
      paginacao();
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
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
              <TableCell>CPF</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Celular</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {associados.length > 0 && associados.map(associado => (
              <TableRow key={associado._id}>
                <TableCell>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      alt={associado.nome}
                      src={associado.imagem.src}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ marginRight: '3px' }}>{associado.nome}</span>
                    {associado.sobrenome &&
                      <span>{associado.sobrenome}</span>
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <span>{associado.cpf}</span>
                </TableCell>
                <TableCell>
                  <span>{associado.email}</span>
                </TableCell>
                <TableCell width={220}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {associado.tel_celular &&
                      <span style={{ lineHeight: '1.2rem' }}>{associado.tel_celular.numero}</span>
                    }
                    {associado.tel_celular.whatsapp &&
                      <FaWhatsapp
                        size={18}
                        color={colors.green['700']}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                        onClick={() => onOpenWhatsAppLink(associado.tel_celular.numero)}
                      />
                    }
                  </div>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setAssociadoSelecionado(associado);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setAssociadoSelecionado(associado);
                      setDeleteDialog(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
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
        associado={associadoSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveAssociado()}
      />
      <Dialog
        open={deleteDialog}
        onClose={() => {
          setAssociadoSelecionado(null);
          setDeleteDialog(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Deletar associado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Digite o CPF <strong>{associadoSelecionado?.cpf}</strong> para confirmar.
          </DialogContentText>
          <InputMask
            mask="999.999.999-99"
            value={cpfConfirmacao}
            maskChar={null}
            onChange={event => setCPFConfirmacao(event.target.value)}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                label="CPF"
                type="text"
                className={classes.fieldMargin}
                fullWidth
                variant="outlined"
              />
            )}
          </InputMask>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              setDeleteDialog(false);
              setAssociadoSelecionado(null);
            }}
          >
            Cancelar
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={removing}
              onClick={() => handleRemoveAssociado()}
            >
              Deletar
            </Button>
            {removing && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </DialogActions>
      </Dialog>
    </Container>
  );

}

export default Associados;
