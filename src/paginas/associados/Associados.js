import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Container,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  LinearProgress,
  CircularProgress,
  colors,
  InputAdornment,
  TablePagination,
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

import CadastrarAssociado from '../../componentes/CadastrarAssociado/CadastrarAssociado';
import ServicoAssociado from '../../servicos/ServicoAssociado';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import { useStyles } from './estilo';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';
import { removeMask } from '../../uteis/string';

const Associados = () => {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const [associadoSelecionado, setAssociadoSelecionado] = useState(null);
  const [cpfConfirmacao, setCPFConfirmacao] = useState(null);
  const [associados, setAssociados] = useState([]);
  const classes = useStyles();

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
    setPage(0);
  };

  const abrirFormulario = associado => {
    if (associado) {
      setAssociadoSelecionado(associado);
    }
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
  };

  function onSaveAssociado() {
    fecharFormulario();
  }

  function onCloseRemoveAssociado() {
    setDeleteDialog(false);
  }

  async function handleRemoveAssociado() {
    try {
      setRemoving(true);
      if (cpfConfirmacao !== associadoSelecionado.cpf) {
        notify.showError('Digite o cpf corretamente para excluir');
        return;
      }
      await ServicoAssociado.deletarAssociado(associadoSelecionado.id);
      notify.showSuccess('Associado excluido');
      onCloseRemoveAssociado();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  function onOpenWhatsAppLink(phone) {
    const whatsappNumber = removeMask(phone);
    const whatsappLink = `https://api.whatsapp.com/send/?phone=+55${whatsappNumber}`;
    window.open(whatsappLink, '_blank');
  }

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Associados',
      key: 'associados',
      path: '/associados',
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let dadosAPI;
        if (searchValue) {
          dadosAPI = await ServicoAssociado.buscarPorNome(
            searchValue,
            rowsPerPage,
            page + 1,
          );
        } else {
          dadosAPI = await ServicoAssociado.obterAssociados(rowsPerPage, page + 1);
        }
        setCount(dadosAPI.count || dadosAPI.length);
        setAssociados(dadosAPI.rows || dadosAPI);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchValue, page, rowsPerPage]);

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
          placeholder="Buscar por título"
          variant="outlined"
          size="small"
          style={{ width: '100%', maxWidth: '400px' }}
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
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
      <TableContainer component={Paper}>
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
            {(() => {
              if (loading) {
                return (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                );
              }
              if (associados.length > 0) {
                return (
                  associados.length > 0 &&
                  associados.map(associado => (
                    <TableRow key={associado._id}>
                      <TableCell>
                        <span>{associado.nome}</span>
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
                          {associado.tel_celular ? (
                            <span style={{ lineHeight: '1.2rem' }}>
                              {associado.tel_celular ? associado.tel_celular : ''}
                            </span>
                          ) : null}
                          {associado.tel_celular && associado.tel_celular.whatsapp ? (
                            <FaWhatsapp
                              size={18}
                              color={colors.green['700']}
                              style={{ marginLeft: '8px', cursor: 'pointer' }}
                              nClick={() => onOpenWhatsAppLink(associado.tel_celular)}
                            />
                          ) : null}
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
                            abrirFormulario(associado);
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
                  ))
                );
              }
              return (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhum associado encontrado
                  </TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={event => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        disabled={loading}
      />

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
