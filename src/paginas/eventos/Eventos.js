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
  Link,
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
  const [selectedEventos, setSelectedEventos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [open, setOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
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

  async function handleDeleteSelected() {
    if (selectedEventos.length === 0) {
      // Não há eventos selecionados, retornar ou realizar outra ação.
      return;
    }

    try {
      setRemoving(true);
      await Promise.all(selectedEventos.map(id => ServicoEvento.deletarEvento(id)));
      setSelectedEventos([]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  const handleSelectEvento = (event, id) => {
    if (event.target.checked) {
      setSelectedEventos(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedEventos(prevSelected => prevSelected.filter(item => item !== id));
    }
  };

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
        setLoading(true);
        let dadosAPI;
        if (searchValue) {
          dadosAPI = await ServicoEvento.buscarPorTitulo(
            searchValue,
            rowsPerPage,
            page + 1,
          );
        } else {
          dadosAPI = await ServicoEvento.listarEventos(rowsPerPage, page + 1);
        }

        const eventosComPreview = await Promise.all(
          dadosAPI.rows.map(async evento => ({
            ...evento,
            previewUrl: await handlePreview(evento.id),
          })),
        );

        setCount(dadosAPI.count || dadosAPI.length);
        setEventos(eventosComPreview);
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
          if (eventos.length > 0) {
            return eventos.map(evento => (
              <Grid item key={evento.id} xs={12} sm={6} md={4}>
                <Card style={{ borderRadius: '16px' }}>
                  <CardMedia
                    component="img"
                    alt="Imagem do Evento"
                    height="220"
                    image={evento.previewUrl}
                    title="Imagem do Evento"
                  />
                  <CardContent>
                    <h2 style={{ fontFamily: 'Arial', wordWrap: 'break-word' }}>
                      Título: {evento.titulo}
                    </h2>
                    <p
                      style={{
                        fontFamily: 'Arial',
                        fontSize: 18,
                        wordWrap: 'break-word',
                      }}
                    >
                      Descrição: {evento.descricao}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Arial',
                        fontSize: 16,
                        wordWrap: 'break-word',
                      }}
                    >
                      Local: {evento.local}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Arial',
                        fontSize: 16,
                        wordWrap: 'break-word',
                      }}
                    >
                      Data:{' '}
                      {`${formatarData(evento.data_inicio)} a ${formatarData(
                        evento.data_fim,
                      )}`}
                    </p>
                    <Link href={evento.link} target="_blank" rel="noopener">
                      {evento.link}
                    </Link>
                  </CardContent>
                  <CardActions>
                    <Checkbox
                      onChange={event => handleSelectEvento(event, evento.id)}
                      checked={selectedEventos.includes(evento.id)}
                    />
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
                  </CardActions>
                </Card>
              </Grid>
            ));
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
        rowsPerPageOptions={[3, 10, 15, 25]}
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
