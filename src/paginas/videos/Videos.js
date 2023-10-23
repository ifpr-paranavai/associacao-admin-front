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
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import YouTube from 'react-youtube';
import CloseIcon from '@material-ui/icons/Close';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const openModal = videoId => {
    setSelectedVideoId(videoId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVideoId(null);
    setModalOpen(false);
  };

  const abrirFormulario = video => {
    if (video) {
      setVideoSelecionado(video);
    }
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
    fetchData();
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
      fetchData();
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
      fetchData();
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

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Videos',
      key: 'videos',
      path: '/videos',
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let dadosAPI;
      if (searchValue) {
        dadosAPI = await ServicoVideo.buscarPorTitulo(searchValue, rowsPerPage, page + 1);
      } else {
        dadosAPI = await ServicoVideo.listarVideos(rowsPerPage, page + 1);
      }
      setCount(dadosAPI.count || dadosAPI.length);
      setVideos(dadosAPI.rows || dadosAPI);
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

  function extractVideoId(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

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
      <Grid container spacing={3}>
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
            return videos.map(video => {
              const videoId = extractVideoId(video.link);
              const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

              return (
                <Grid item key={video.id} xs={12} sm={6} md={4}>
                  <Card
                    style={{
                      borderRadius: '16px',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt="Thumbnail do Video"
                      height="220"
                      image={thumbnailUrl}
                      title="Thumbnail do Video"
                      onClick={() => openModal(videoId)}
                    />
                    <CardContent>
                      <h2 style={{ fontFamily: 'Arial', wordWrap: 'break-word' }}>
                        Título: {video.titulo}
                      </h2>
                    </CardContent>
                    <CardActions>
                      <Checkbox
                        onChange={event => handleSelectVideo(event, video.id)}
                        checked={selectedVideos.includes(video.id)}
                      />
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
                    </CardActions>
                  </Card>
                </Grid>
              );
            });
          }
          return (
            <Grid>
              <TableCell colSpan={3} align="center">
                Nenhuma ata encontrada
              </TableCell>
            </Grid>
          );
        })()}
      </Grid>
      <TablePagination
        rowsPerPageOptions={[3, 6, 12, 24]}
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
        onClose={() => onCloseRemoveVideo()}
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
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="lg" scroll="body">
        <IconButton
          edge="end"
          color="inherit"
          onClick={closeModal}
          style={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {selectedVideoId && (
            <YouTube
              videoId={selectedVideoId}
              opts={{ height: '540px', width: '960px' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Videos;
