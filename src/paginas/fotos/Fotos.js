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
import Config from '../../uteis/configuracao';
import CadastrarFoto from '../../componentes/CadastrarFoto/CadastrarFoto';
import ServicoFoto from '../../servicos/ServicoFoto';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

function Fotos() {
  const [selectedFotos, setSelectedFotos] = useState([]);
  const [Fotos, setFotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [Fotoselecionado, setFotoselecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFotoId, setSelectedFotoId] = useState(null);

  const openModal = FotoId => {
    setSelectedFotoId(FotoId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFotoId(null);
    setModalOpen(false);
  };

  const abrirFormulario = Foto => {
    if (Foto) {
      setFotoselecionado(Foto);
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

  function onSaveFoto() {
    fecharFormulario();
  }

  function onCloseRemoveFoto() {
    setDeleteDialog(false);
    setFotoselecionado(null);
  }

  async function handleRemoveFoto() {
    try {
      setRemoving(true);
      await ServicoFoto.deletarFoto(Fotoselecionado.id);
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
      // Não há Fotos selecionados, retornar ou realizar outra ação.
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

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Fotos',
      key: 'Fotos',
      path: '/Fotos',
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
      setCount(dadosAPI.count || dadosAPI.length);
      setFotos(dadosAPI.rows || dadosAPI);
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

  function extractFotoId(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)(?:\/.*)?/;
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
          if (Fotos.length > 0) {
            return Fotos.map(Foto => {
              const fotoId = extractFotoId(Foto.link);
              const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fotoId}&sz=w400`;
              const FotoTelaCheia = `https://drive.google.com/uc?id=${fotoId}`;

              return (
                <Grid item key={Foto.id} xs={12} sm={6} md={4}>
                  <Card
                    style={{
                      borderRadius: '16px',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt="Thumbnail do Foto"
                      height="220"
                      image={thumbnailUrl}
                      title="Thumbnail do Foto"
                      onClick={() => openModal(FotoTelaCheia)}
                    />
                    <CardContent>
                      <h2 style={{ fontFamily: 'Arial', wordWrap: 'break-word' }}>
                        Título: {Foto.titulo}
                      </h2>
                    </CardContent>
                    <CardActions>
                      <Checkbox
                        onChange={event => handleSelectFoto(event, Foto.id)}
                        checked={selectedFotos.includes(Foto.id)}
                      />
                      <IconButton
                        aria-label="editar"
                        onClick={() => {
                          setFotoselecionado(Foto);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="deletar"
                        onClick={() => {
                          setFotoselecionado(Foto);
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
      {!loading && Fotos.length >= 1 && (
        <TablePagination
          rowsPerPageOptions={[3, 6, 12, 24]}
          component="div"
          count={count || 0}
          rowsPerPage={rowsPerPage}
          page={page || 0}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={event => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          disabled={loading}
        />
      )}
      <CadastrarFoto
        open={open}
        Foto={Fotoselecionado}
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
          {Fotoselecionado && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {Fotoselecionado.titulo}
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
          {selectedFotoId && (
            <img src={selectedFotoId} alt="Imagem" style={{ width: '100%' }} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Fotos;
