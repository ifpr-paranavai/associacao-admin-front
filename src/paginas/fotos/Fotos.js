import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Checkbox,
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
import Axios from 'axios';
import Config from '../../uteis/configuracao';
import CadastrarFoto from '../../componentes/CadastrarFoto/CadastrarFoto';
import ServicoFoto from '../../servicos/ServicoFoto';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

function Fotos() {
  const [selectedFotos, setSelectedFotos] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [fotoSelecionado, setFotoSelecionado] = useState(null);
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

  const abrirFormulario = foto => {
    if (foto) {
      setFotoSelecionado(foto);
    }
    setOpen(true);
  };

  const fecharFormulario = () => {
    setOpen(false);
    fetchData();
  };

  function onSaveFoto() {
    fecharFormulario();
  }

  function onCloseRemoveFoto() {
    setDeleteDialog(false);
    setFotoSelecionado(null);
  }

  async function handleRemoveFoto() {
    try {
      setRemoving(true);
      await ServicoFoto.deletarFoto(fotoSelecionado.id);
      onCloseRemoveFoto();
      fetchData();
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  async function handleDeleteSelected() {
    if (selectedFotos.length === 0) {
      // Não há fotos selecionadas, retornar ou realizar outra ação.
      return;
    }
    try {
      setRemoving(true);
      await Promise.all(selectedFotos.map(id => ServicoFoto.deletarFoto(id)));
      setSelectedFotos([]);
      fetchData();
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  const handleSelectFoto = (event, id) => {
    if (event.target.checked) {
      setSelectedFotos(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedFotos(prevSelected => prevSelected.filter(item => item !== id));
    }
  };

  async function handleDownloadAnexo(id) {
    try {
      const response = await Axios.get(`${Config.api}/fotos/${id}/anexo/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
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

  async function handlePreview(id) {
    try {
      const response = await Axios.get(`${Config.api}/fotos/${id}/anexo/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error) {
      notify.showError(`${error}`);
    }
  }

  async function handlePreviewAnexo(id) {
    try {
      const response = await Axios.get(`${Config.api}/fotos/${id}/anexo/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      notify.showError(`${error}`);
    }
  }

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Fotos',
      key: 'fotos',
      path: '/fotos',
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let dadosAPI;
      if (searchValue) {
        dadosAPI = await ServicoFoto.buscarPorTitulo(searchValue, rowsPerPage, page + 1);
      } else {
        dadosAPI = await ServicoFoto.listarFotos(rowsPerPage, page + 1);
      }

      const fotosComPreview = await Promise.all(
        dadosAPI.rows.map(async foto => ({
          ...foto,
          previewUrl: await handlePreview(foto.id),
        })),
      );

      setCount(dadosAPI.count || dadosAPI.length);
      setFotos(fotosComPreview);
      setLoading(false);
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
          placeholder="Buscar por titulo ou data"
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
              <TableCell>Fotos</TableCell>
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
              if (fotos.length > 0) {
                return fotos.map(foto => (
                  <TableRow key={foto.id}>
                    <TableCell padding="checkbox">
                      <Checkbox onChange={event => handleSelectFoto(event, foto.id)} />
                    </TableCell>
                    <TableCell className={styles.celula}>{foto.titulo}</TableCell>
                    <TableCell>
                      <img src={foto.previewUrl} alt="Preview" width="100" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="editar"
                        onClick={() => {
                          setFotoSelecionado(foto);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="deletar"
                        onClick={() => {
                          setFotoSelecionado(foto);
                          setDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="visualizar"
                        onClick={() => {
                          handlePreviewAnexo(foto.id);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="download"
                        onClick={() => {
                          handleDownloadAnexo(foto.id);
                        }}
                      >
                        <GetAppIcon />
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
      <CadastrarFoto
        open={open}
        foto={fotoSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveFoto()}
      />
      <Dialog
        open={deleteDialog}
        onClose={() => onCloseRemoveFoto()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '20px' }}>
          Excluir associado:
          {fotoSelecionado && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {fotoSelecionado.titulo}
            </span>
          )}
        </DialogTitle>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button
            color="primary"
            onClick={() => {
              onCloseRemoveFoto();
            }}
          >
            Cancelar
          </Button>
          <div className={styles.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={removing}
              onClick={() => handleRemoveFoto()}
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

export default Fotos;
