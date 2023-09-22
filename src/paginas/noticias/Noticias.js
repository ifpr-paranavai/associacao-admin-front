import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Checkbox,
  Card,
  Grid,
  CardContent,
  CardMedia,
  CardActions,
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
import CadastrarNoticia from '../../componentes/CadastrarNoticia/CadastrarNoticia';
import ServicoNoticia from '../../servicos/ServicoNoticia';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';
import { formatarData } from '../../uteis/formatarData';

function Noticias() {
  const [selectedNoticias, setSelectedNoticias] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [open, setOpen] = useState(false);
  const [noticiaSelecionado, setNoticiaSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const abrirFormulario = noticia => {
    if (noticia) {
      setNoticiaSelecionado(noticia);
    }
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
  };

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
    setPage(0);
  };

  function onSaveNoticia() {
    fecharFormulario();
  }

  function onCloseRemoveNoticia() {
    setDeleteDialog(false);
    setNoticiaSelecionado(null);
  }

  async function handleRemoveNoticia() {
    try {
      setRemoving(true);
      await ServicoNoticia.deletarNoticia(noticiaSelecionado.id);
      onCloseRemoveNoticia();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  async function handlePreviewAnexo(id) {
    try {
      const response = await Axios.get(`${Config.api}/noticias/${id}/anexo/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      notify.showError(`${error}`);
    }
  }

  async function handlePreview(id) {
    try {
      const response = await Axios.get(`${Config.api}/noticias/${id}/anexo/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error) {
      notify.showError(`${error}`);
    }
  }

  async function handleDeleteSelected() {
    if (selectedNoticias.length === 0) {
      // Não há eventos selecionados, retornar ou realizar outra ação.
      return;
    }
    try {
      setRemoving(true);
      await Promise.all(selectedNoticias.map(id => ServicoNoticia.deletarNoticia(id)));
      setSelectedNoticias([]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  const handleSelectNoticia = (event, id) => {
    if (event.target.checked) {
      setSelectedNoticias(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedNoticias(prevSelected => prevSelected.filter(item => item !== id));
    }
  };

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Noticias',
      key: 'noticias',
      path: '/noticias',
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let dadosAPI;
        if (searchValue) {
          dadosAPI = await ServicoNoticia.buscarPorTitulo(
            searchValue,
            rowsPerPage,
            page + 1,
          );
        } else {
          dadosAPI = await ServicoNoticia.listarNoticias(rowsPerPage, page + 1);
        }

        const noticiasComPreview = await Promise.all(
          dadosAPI.rows.map(async noticia => ({
            ...noticia,
            previewUrl: await handlePreview(noticia.id),
          })),
        );

        setCount(dadosAPI.count || dadosAPI.length);
        setNoticias(noticiasComPreview);
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
          if (noticias.length > 0) {
            return noticias.map(noticia => (
              <Grid item key={noticia.id} xs={12} sm={6} md={4}>
                <Card style={{ borderRadius: '16px' }}>
                  <CardMedia
                    component="img"
                    alt="Imagem da notícia"
                    height="220"
                    image={noticia.previewUrl}
                    title="Imagem da notícia"
                  />
                  <CardContent>
                    <h2>{noticia.titulo}</h2>
                    <p>{noticia.descricao}</p>
                    <p>{formatarData(noticia.data_inicio)}</p>
                  </CardContent>
                  <CardActions>
                    <Checkbox
                      onChange={event => handleSelectNoticia(event, noticia.id)}
                      checked={selectedNoticias.includes(noticia.id)}
                    />
                    <IconButton
                      aria-label="editar"
                      onClick={() => {
                        setNoticiaSelecionado(noticia);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="deletar"
                      onClick={() => {
                        setNoticiaSelecionado(noticia);
                        setDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ));
          }
          return (
            <Grid>
              <TableCell colSpan={3} align="center">
                Nenhuma noticia encontrada
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
      <CadastrarNoticia
        open={open}
        noticia={noticiaSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveNoticia()}
      />
      <Dialog
        open={deleteDialog}
        onClose={() => {
          onCloseRemoveNoticia();
          window.location.reload();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '20px' }}>
          Excluir associado:
          {noticiaSelecionado && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {noticiaSelecionado.titulo}
            </span>
          )}
        </DialogTitle>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button
            color="primary"
            onClick={() => {
              onCloseRemoveNoticia();
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
              onClick={() => handleRemoveNoticia()}
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

export default Noticias;
