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
import Axios from 'axios';
import CadastrarEvento from '../../componentes/CadastrarEvento/CadastrarEvento';
import ServicoEvento from '../../servicos/ServicoEvento';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';
import Config from '../../uteis/configuracao';
import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';
import { formatarData } from '../../uteis/formatarData';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [open, setOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();

  const abrirFormulario = () => {
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
  };

  function onSaveEvento() {
    fecharFormulario();
  }

  function onCloseRemoveEvento() {
    setDeleteDialog(false);
    setEventoSelecionado(null);
  }

  async function handleRemoveEvento() {
    try {
      setRemoving(true);
      await ServicoEvento.deletarEvento(eventoSelecionado.id);
      onCloseRemoveEvento();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  async function handlePreview(id) {
    try {
      const response = await Axios.get(`${Config.api}/eventos/${id}/anexo/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error) {
      notify.showError(`${error}`);
    }
  }

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Eventos',
      key: 'eventos',
      path: '/eventos',
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const dadosAPI = await ServicoEvento.listarEventos();
        const eventosComUrl = await Promise.all(
          dadosAPI.map(async evento => {
            const url = await handlePreview(evento.id);
            return { ...evento, url };
          }),
        );
        setEventos(eventosComUrl);
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
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Titulo</TableCell>
              <TableCell>Imagem</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Local</TableCell>
              <TableCell>Data</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {eventos.map(evento => (
              <TableRow key={evento.id}>
                <TableCell className={styles.celula}>{evento.titulo}</TableCell>
                <TableCell>
                  <img src={evento.url} alt="Preview" width="100" />
                </TableCell>
                <TableCell className={styles.celula}>{evento.descricao}</TableCell>
                <TableCell className={styles.celula}>{evento.local}</TableCell>
                <TableCell className={styles.celula}>
                  {formatarData(evento.data_inicio)} - {formatarData(evento.data_fim)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="editar"
                    onClick={() => {
                      setEventoSelecionado(evento);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="deletar"
                    onClick={() => {
                      setEventoSelecionado(evento);
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
      <CadastrarEvento
        open={open}
        evento={eventoSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveEvento()}
      />
      <Dialog
        open={deleteDialog}
        onClose={() => {
          onCloseRemoveEvento();
          window.location.reload();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '20px' }}>
          Excluir associado:
          {eventoSelecionado && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {eventoSelecionado.titulo}
            </span>
          )}
        </DialogTitle>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button
            color="primary"
            onClick={() => {
              onCloseRemoveEvento();
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
              onClick={() => handleRemoveEvento()}
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

export default Eventos;
