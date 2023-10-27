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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
import EditarTextoModal from '../../componentes/EditarTextoModal/EditarTextoModal';
import ServicoTextoModal from '../../servicos/ServicoTextoModal';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

function TextoModal() {
  const [selectedTextoModal, setSelectedTextoModal] = useState([]);
  const [TextoModal, setTextoModal] = useState([]);
  const [open, setOpen] = useState(false);
  const [TextoModalSelecionado, setTextoModalSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTextoModalId, setSelectedTextoModalId] = useState(null);

  const fecharFormulario = () => {
    setOpen(false);
    fetchData();
  };

  function onSaveTextoModal() {
    fecharFormulario();
  }

  function onCloseRemoveTextoModal() {
    setDeleteDialog(false);
    setTextoModalSelecionado(null);
  }

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Modificar o site',
      key: 'site',
      path: '/site',
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const dadosAPI = await ServicoTextoModal.listarTextoModal();
      setTextoModal(dadosAPI);
      setLoading(false);
    } catch (error) {
      // Trate o erro aqui conforme necessário
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container className={styles.root}>
      <Breadcrumbs />
      <TableContainer component={Paper}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Titulo</TableCell>
              <TableCell>Corpo</TableCell>
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
              if (TextoModal.length > 0) {
                return TextoModal.map(textoModal => (
                  <TableRow key={textoModal.id}>
                    <TableCell> </TableCell>
                    <TableCell className={styles.celula}>{textoModal.titulo}</TableCell>
                    <ReactQuill
                      value={
                        textoModal.corpo.length > 360
                          ? `${textoModal.corpo.substring(0, 360)}...`
                          : textoModal.corpo
                      }
                      readOnly
                      theme={null}
                    />
                    <TableCell align="right">
                      <IconButton
                        aria-label="editar"
                        onClick={() => {
                          setTextoModalSelecionado(TextoModal);
                          setOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ));
              }
              return (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhum texto encontrado
                  </TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
        </Table>
      </TableContainer>
      <EditarTextoModal
        open={open}
        textoModal={TextoModalSelecionado}
        fecharFormulario={fecharFormulario}
        onSave={() => onSaveTextoModal()}
      />
    </Container>
  );
}

export default TextoModal;
