import React, { useState, useEffect } from 'react';
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
import CadastrarVideo from '../../componentes/CadastrarVideo/CadastrarVideo';
import ServicoVideo from '../../servicos/ServicoVideo';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

function Videos() {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [open, setOpen] = useState(false);
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const abrirFormulario = () => {
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
  };

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
    setPage(0);
  };

  function onSaveVideo() {
    fecharFormulario();
  }

  function onCloseRemoveVideo() {
    setDeleteDialog(false);
    setVideoSelecionado(null);
  }

  async function handleRemoveVideo() {
    try {
      setRemoving(true);
      await ServicoVideo.deletarVideo(videoSelecionado.id);
      onCloseRemoveVideo();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  async function handleDeleteSelected() {
    if (selectedVideos.length === 0) {
      // Não há videos selecionados, retornar ou realizar outra ação.
      return;
    }
    try {
      setRemoving(true);
      await Promise.all(selectedVideos.map(id => ServicoVideo.deletarVideo(id)));
      setSelectedVideos([]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  const handleSelectVideo = (event, id) => {
    if (event.target.checked) {
      setSelectedVideos(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedVideos(prevSelected => prevSelected.filter(item => item !== id));
    }
  };

  async function handleDownloadAnexo(id) {
    try {
      const response = await Axios.get(`${Config.api}/videos/${id}/anexo/download`, {
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

  async function handlePreviewAnexo(id) {
    try {
      const response = await Axios.get(`${Config.api}/videos/${id}/anexo/download`, {
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
      title: 'Gestão de Videos',
      key: 'videos',
      path: '/videos',
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let dadosAPI;
        if (searchValue) {
          dadosAPI = await ServicoVideo.buscarPorTitulo(
            searchValue,
            rowsPerPage,
            page + 1,
          );
        } else {
          dadosAPI = await ServicoVideo.listarVideos(rowsPerPage, page + 1);
        }
        setCount(dadosAPI.count || dadosAPI.length);
        setVideos(dadosAPI.rows || dadosAPI);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchValue, page, rowsPerPage]);

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
              if (videos.length > 0) {
                return videos.map(video => (
                  <TableRow key={video.id}>
                    <TableCell padding="checkbox">
                      <Checkbox onChange={event => handleSelectVideo(event, video.id)} />
                    </TableCell>
                    <TableCell className={styles.celula}>{video.titulo}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="editar"
                        onClick={() => {
                          setVideoSelecionado(video);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="deletar"
                        onClick={() => {
                          setVideoSelecionado(video);
                          setDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="visualizar"
                        onClick={() => {
                          handlePreviewAnexo(video.id);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="download"
                        onClick={() => {
                          handleDownloadAnexo(video.id);
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
                    Nenhum video encontrado
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
      <CadastrarVideo
        open={open}
        video={videoSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveVideo()}
      />
      <Dialog
        open={deleteDialog}
        onClose={() => {
          onCloseRemoveVideo();
          window.location.reload();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '20px' }}>
          Excluir associado:
          {videoSelecionado && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {videoSelecionado.titulo}
            </span>
          )}
        </DialogTitle>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button
            color="primary"
            onClick={() => {
              onCloseRemoveVideo();
              window.location.reload();
            }}
          >
            Cancelar
          </Button>
          <div className={styles.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={removing}
              onClick={() => handleRemoveVideo()}
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

export default Videos;
