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
import CadastrarAta from '../../componentes/CadastrarAta/CadastrarAta';
import ServicoAta from '../../servicos/ServicoAta';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

function Atas() {
  const [atas, setAtas] = useState([]);
  const [open, setOpen] = useState(false);
  const [ataSelecionado, setAtaSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();

  const abrirFormulario = () => {
    setOpen(true);
  };
  const fecharFormulario = () => {
    setOpen(false);
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const dadosAPI = await ServicoAta.listarAtas();
        setAtas(dadosAPI);
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
          placeholder="Buscar por titulo"
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
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {atas.map(ata => (
              <TableRow key={ata.id}>
                <TableCell className={styles.celula}>{ata.titulo}</TableCell>
                <TableCell className={styles.celula}>{ata.descricao}</TableCell>
                <TableCell align="right">
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
