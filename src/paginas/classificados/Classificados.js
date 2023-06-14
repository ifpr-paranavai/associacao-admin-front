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
import CadastrarClassificado from '../../componentes/CadastrarClassificado/CadastrarClassificado';
import ServicoClassificado from '../../servicos/ServicoClassificado';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';
import { formatarData } from '../../uteis/formatarData';

function Classificados() {
  const [classificados, setClassificados] = useState([]);
  const [open, setOpen] = useState(false);
  const [classificadoSelecionado, setClassificadoSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();

  const abrirFormulario = () => {
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
  };

  function onSaveClassificado() {
    fecharFormulario();
  }

  function onCloseRemoveClassificado() {
    setDeleteDialog(false);
    setClassificadoSelecionado(null);
  }

  async function handleRemoveClassificado() {
    try {
      setRemoving(true);
      await ServicoClassificado.deletarClassificado(classificadoSelecionado.id);
      onCloseRemoveClassificado();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  async function handleDownloadAnexo(id) {
    try {
      const response = await Axios.get(
        `${Config.api}/classificados/${id}/anexo/download`,
        {
          responseType: 'blob',
        },
      );
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
      const response = await Axios.get(
        `${Config.api}/classificados/${id}/anexo/download`,
        {
          responseType: 'blob',
        },
      );
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
      title: 'Gestão de Classificados',
      key: 'classificados',
      path: '/classificados',
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const dadosAPI = await ServicoClassificado.listarClassificados();
        setClassificados(dadosAPI);
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
              <TableCell>Descrição</TableCell>
              <TableCell>Foto_video</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {classificados.map(classificado => (
              <TableRow key={classificado.id}>
                <TableCell className={styles.celula}>{classificado.titulo}</TableCell>
                <TableCell className={styles.celula}>{classificado.descricao}</TableCell>
                <TableCell className={styles.celula}>
                  {classificado.foto_video}
                  <IconButton
                    aria-label="visualizar"
                    onClick={() => {
                      handlePreviewAnexo(classificado.id);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    aria-label="download"
                    onClick={() => {
                      handleDownloadAnexo(classificado.id);
                    }}
                  >
                    <GetAppIcon />
                  </IconButton>
                </TableCell>
                <TableCell className={styles.celula}>{classificado.preco}</TableCell>
                <TableCell className={styles.celula}>{classificado.usuario}</TableCell>
                <TableCell className={styles.celula}>{classificado.contato}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="editar"
                    onClick={() => {
                      setClassificadoSelecionado(classificado);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="deletar"
                    onClick={() => {
                      setClassificadoSelecionado(classificado);
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
      <CadastrarClassificado
        open={open}
        classificado={classificadoSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveClassificado()}
      />
      <Dialog
        open={deleteDialog}
        onClose={() => onCloseRemoveClassificado()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ padding: '20px' }}>
          Excluir associado:
          {classificadoSelecionado && (
            <span style={{ marginRight: '10px', marginLeft: '10px' }}>
              {classificadoSelecionado.titulo}
            </span>
          )}
        </DialogTitle>
        <DialogActions style={{ justifyContent: 'space-around', padding: '10px' }}>
          <Button color="primary" onClick={() => onCloseRemoveClassificado()}>
            Cancelar
          </Button>
          <div className={styles.wrapper}>
            <Button
              variant="contained"
              color="primary"
              disabled={removing}
              onClick={() => handleRemoveClassificado()}
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

export default Classificados;
