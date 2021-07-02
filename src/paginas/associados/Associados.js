import React, { useState, useEffect } from 'react';
import {
  Box,
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
  InputAdornment,
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
  Search as SearchIcon,
} from '@material-ui/icons';
import { FaWhatsapp } from 'react-icons/fa';

import { useDebouncedCallback } from 'use-debounce';
import CadastrarAssociado from '../../componentes/CadastrarAssociado/CadastrarAssociado';
import ServicoAssociado from '../../servicos/ServicoAssociado';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import { useStyles } from './estilo';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';
import { isValidCPF, removeMask } from '../../uteis/string';

const Associados = () => {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const notify = useNotify();
  const { setLocation } = useNavigation();

  const [associadoSelecionado, setAssociadoSelecionado] = useState(null);
  const [cpfConfirmacao, setCPFConfirmacao] = useState(null);
  const [termoBuscado, setTermoBuscado] = useState('');
  const [associados, setAssociados] = useState([]);
  const [page, setPage] = useState(0);
  const [oldPage, setOldPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [start, setStart] = useState(0);

  const abrirFormulario = () => {
    setOpen(true);
  }; // abrir o dialogo

  const fecharFormulario = () => {
    setOpen(false);
    setAssociadoSelecionado(null);
  }; // fechar o dialogo

  async function paginacao(filter) {
    try {
      setLoading(true);
      const associados = await ServicoAssociado.obterAssociados({
        start,
        perPage,
        filter,
      });
      setAssociados(associados.data);
      setTotal(associados.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    paginacao();
    setLocation({
      title: 'Gestão de Associados',
      key: 'associados',
      path: '/associados',
    });
  }, [start, perPage]);

  const debouncedPaginacao = useDebouncedCallback(filter => paginacao(filter), 480);

  useEffect(() => {
    const filter = {};

    if (!termoBuscado) {
      paginacao();
      return;
    }

    if (isValidCPF(termoBuscado)) {
      filter.cpf = termoBuscado;
    } else {
      delete filter.cpf;

      const [nome, sobrenome] = termoBuscado.split(' ');
      filter.nome = nome;
      filter.sobrenome = sobrenome;
    }

    debouncedPaginacao(filter);
  }, [termoBuscado]);

  async function onChangePage(event, nextPage) {
    event.preventDefault();

    const operator = nextPage < oldPage ? -1 : 1;
    setStart(start + perPage * operator);
    setPage(nextPage);
    setOldPage(nextPage);
  }

  async function onChangeRowsPerPage(event) {
    event.preventDefault();
    setPerPage(event.target.value);
  }

  function onSaveAssociado() {
    paginacao();
    fecharFormulario();
  }

  function onOpenWhatsAppLink(phone) {
    const whatsappNumber = removeMask(phone);
    const whatsappLink = `https://api.whatsapp.com/send/?phone=+55${whatsappNumber}`;
    window.open(whatsappLink, '_blank');
  }

  function onCloseRemoveAssociado() {
    setDeleteDialog(false);
    setCPFConfirmacao(null);
    setAssociadoSelecionado(null);
  }

  async function handleRemoveAssociado() {
    if (cpfConfirmacao !== associadoSelecionado.cpf) {
      notify.showWarning(
        'O CPF informado não corresponde ao do associado a ser removido!',
      );
      return;
    }
    try {
      setRemoving(true);
      await ServicoAssociado.deletarAssociado(associadoSelecionado._id);

      onCloseRemoveAssociado();
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
      <Breadcrumbs />
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        paddingBottom="18px"
        paddingTop="12px"
      >
        <TextField
          value={termoBuscado}
          placeholder="Buscar por nome ou CPF"
          variant="outlined"
          size="small"
          style={{ width: '100%', maxWidth: '400px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          onChange={event => setTermoBuscado(event.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={abrirFormulario}
        >
          Adicionar
        </Button>
      </Box>

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
              <TableCell>Perfil de acesso</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {associados.length > 0 &&
              associados.map(associado => (
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
                      {associado.sobrenome && <span>{associado.sobrenome}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{associado.cpf}</span>
                  </TableCell>
                  <TableCell>
                    <span>{associado.email}</span>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {associado.tel_celular && (
                        <span style={{ lineHeight: '1.2rem' }}>
                          {associado.tel_celular.numero}
                        </span>
                      )}
                      {associado.tel_celular.whatsapp && (
                        <FaWhatsapp
                          size={18}
                          color={colors.green['700']}
                          style={{ marginLeft: '8px', cursor: 'pointer' }}
                          onClick={() => onOpenWhatsAppLink(associado.tel_celular.numero)}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{associado.perfil}</span>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="editar"
                      onClick={() => {
                        setAssociadoSelecionado(associado);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="deletar"
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
          rowsPerPageOptions={[3, 10, 15, 25, 40]}
          count={total}
          rowsPerPage={perPage}
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
        onClose={() => onCloseRemoveAssociado()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '12px' }}>
          Excluir associado:
          {associadoSelecionado && (
            <span style={{ marginRight: '4px', marginLeft: '4px' }}>
              {associadoSelecionado.nome}
            </span>
          )}
          {associadoSelecionado?.sobrenome && (
            <span>{associadoSelecionado.sobrenome}</span>
          )}
        </DialogTitle>
        <DialogContent style={{ padding: '12px' }}>
          <DialogContentText>
            Digite o CPF <strong>{associadoSelecionado?.cpf}</strong> para confirmar.
          </DialogContentText>
          <InputMask
            mask="999.999.999-99"
            value={cpfConfirmacao}
            maskChar={null}
            onChange={event => setCPFConfirmacao(event.target.value)}
          >
            {inputProps => (
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
        <DialogActions style={{ padding: '4px' }}>
          <Button color="primary" onClick={() => onCloseRemoveAssociado()}>
            Cancelar
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={removing}
              onClick={() => handleRemoveAssociado()}
            >
              Excluir
            </Button>
            {removing && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Associados;
