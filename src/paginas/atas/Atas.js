import React, { useState, useEffect, useCallback } from 'react';
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
  Checkbox,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
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
import Config from '../../uteis/configuracao';
import CadastrarAta from '../../componentes/CadastrarAta/CadastrarAta';
import ServicoAta from '../../servicos/ServicoAta';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

function Atas() {
  const [selectedAtas, setSelectedAtas] = useState([]);
  const [atas, setAtas] = useState([]);
  const [open, setOpen] = useState(false);
  const [ataSelecionado, setAtaSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
    setPage(0);
  };

  const abrirFormulario = ata => {
    if (ata) {
      setAtaSelecionado(ata);
    }
    setOpen(true);
  };

  const fecharFormulario = () => {
    setOpen(false);
    fetchData();
  };

  function onSaveAta() {
    fecharFormulario();
  }

  function onCloseRemoveAta() {
    setDeleteDialog(false);
    setAtaSelecionado(null);
  }

  async function handleRemoveAta() {
    try {
      setRemoving(true);
      await ServicoAta.deletarAta(ataSelecionado.id);
      onCloseRemoveAta();
      fetchData();
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  async function handleDeleteSelected() {
    if (selectedAtas.length === 0) {
      // Não há eventos selecionados, retornar ou realizar outra ação.
      return;
    }
    try {
      setRemoving(true);
      await Promise.all(selectedAtas.map(id => ServicoAta.deletarAta(id)));
      setSelectedAtas([]);
      fetchData();
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  const handleSelectAta = (event, id) => {
    if (event.target.checked) {
      setSelectedAtas(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedAtas(prevSelected => prevSelected.filter(item => item !== id));
    }
  };

  async function handleDownloadAnexo(id) {
    try {
      const blob = await ServicoAta.downloadAnexo(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `anexo_${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      notify.showError(`${error}`);
    }
  }

  async function handlePreviewAnexo(id) {
    try {
      const blob = await ServicoAta.downloadAnexo(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      notify.showError(`${error}`);
    }
  }

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Atas',
      key: 'atas',
      path: '/atas',
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let dadosAPI;
      if (searchValue) {
        dadosAPI = await ServicoAta.buscarPorTitulo(searchValue, rowsPerPage, page + 1);
      } else {
        dadosAPI = await ServicoAta.listarAtas(rowsPerPage, page + 1);
      }
      setCount(dadosAPI.count || dadosAPI.length);
      setAtas(dadosAPI.rows || dadosAPI);
    } catch (error) {
      // Trate o erro aqui conforme necessário
    } finally {
      setLoading(false);
    }
  }, [searchValue, page, rowsPerPage]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container className={styles.root}>
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
        <Box display="flex" flexDirection="row" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={abrirFormulario}
            style={{ marginRight: '8px' }}
          >
            Adicionar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
          >
            Excluir
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Titulo</TableCell>
              <TableCell>Descrição</TableCell>
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
              if (atas.length > 0) {
                return atas.map(ata => (
                  <TableRow key={ata.id}>
                    <TableCell padding="checkbox">
                      <Checkbox onChange={event => handleSelectAta(event, ata.id)} />
                    </TableCell>
                    <TableCell className={styles.celula}>{ata.titulo}</TableCell>
                    <TableCell className={styles.celula}>{ata.descricao}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="visualizar"
                        onClick={() => {
                          handlePreviewAnexo(ata.id);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="editar"
                        onClick={() => {
                          setAtaSelecionado(ata);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="download"
                        onClick={() => {
                          handleDownloadAnexo(ata.id);
                        }}
                      >
                        <GetAppIcon />
                      </IconButton>
                      <IconButton
                        aria-label="deletar"
                        onClick={() => {
                          setAtaSelecionado(ata);
                          setDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ));
              }
              return (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhuma ata encontrada
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
      <CadastrarAta
        open={open}
        ata={ataSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveAta()}
      />
      <Dialog
        open={deleteDialog}
        onClose={() => onCloseRemoveAta()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '20px' }}>
          Excluir associado:
          {ataSelecionado && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {ataSelecionado.titulo}
            </span>
          )}
        </DialogTitle>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button color="primary" onClick={() => onCloseRemoveAta()}>
            Cancelar
          </Button>
          <div className={styles.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={removing}
              onClick={() => handleRemoveAta()}
            >
              Excluir
            </Button>
            {removing && <CircularProgress size={24} className={styles.buttonProgress} />}
          </div>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Atas;
