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

  const abrirFormulario = () => {
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
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
        const dadosAPI = await ServicoNoticia.listarNoticias();
        const noticiasComUrl = await Promise.all(
          dadosAPI.map(async noticia => {
            const url = await handlePreview(noticia.id);
            return { ...noticia, url };
          }),
        );
        setNoticias(noticiasComUrl);
      } catch (error) {
        // console.error('Erro ao buscar dados da API:', error);
      }
    }
    fetchData();
  }, []);

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
              <TableCell>Imagem</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {noticias.map(noticia => (
              <TableRow key={noticia.id}>
                <TableCell padding="checkbox">
                  <Checkbox onChange={event => handleSelectNoticia(event, noticia.id)} />
                </TableCell>
                <TableCell className={styles.celula}>{noticia.titulo}</TableCell>
                <TableCell>
                  <img src={noticia.url} alt="Preview" width="100" />
                </TableCell>
                <TableCell className={styles.celula}>{noticia.descricao}</TableCell>
                <TableCell className={styles.celula}>
                  {formatarData(noticia.data_inicio)}
                </TableCell>
                <TableCell align="right">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
