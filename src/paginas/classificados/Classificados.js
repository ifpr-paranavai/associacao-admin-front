import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Checkbox,
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
  InputAdornment,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import GetAppIcon from '@material-ui/icons/GetApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import DialogTitle from '@material-ui/core/DialogTitle';

import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@material-ui/icons';

import Axios from 'axios';
import Config from '../../uteis/configuracao';
import PreviewModal from './PreviewModal';
import CadastrarClassificado from '../../componentes/CadastrarClassificado/CadastrarClassificado';
import ServicoClassificado from '../../servicos/ServicoClassificado';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

function Classificados() {
  const [selectedClassificados, setSelectedClassificados] = useState([]);
  const [classificados, setClassificados] = useState([]);
  const [open, setOpen] = useState(false);
  const [classificadoSelecionado, setClassificadoSelecionado] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [modalPreviewAberto, setModalPreviewAberto] = useState(false);
  const notify = useNotify();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const abrirFormulario = classificados => {
    if (classificados) {
      setClassificadoSelecionado(classificados);
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

  function onSaveClassificado() {
    fecharFormulario();
  }

  function onCloseRemoveClassificado() {
    setDeleteDialog(false);
    setClassificadoSelecionado(null);
  }

  async function handleDeleteSelected() {
    if (selectedClassificados.length === 0) {
      return;
    }
    try {
      setRemoving(true);
      await Promise.all(
        selectedClassificados.map(id => ServicoClassificado.deletarClassificado(id)),
      );
      setSelectedClassificados([]);
      fetchData();
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  async function handleRemoveClassificado() {
    try {
      setRemoving(true);
      await ServicoClassificado.deletarClassificado(classificadoSelecionado.id);
      onCloseRemoveClassificado();
      fetchData();
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setRemoving(false);
    }
  }

  const handleSelectClassificado = (event, id) => {
    if (event.target.checked) {
      setSelectedClassificados(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedClassificados(prevSelected => prevSelected.filter(item => item !== id));
    }
  };

  async function handleDownloadAnexo(id) {
    try {
      const response = await Axios.get(
        `${Config.api}/classificados/${id}/anexo/download`,
        {
          responseType: 'arraybuffer',
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
      notify.showError(`Erro ao fazer o download do anexo: ${error.message}`);
    }
  }

  const handlePreviewAnexo = async id => {
    try {
      const response = await Axios.get(
        `${Config.api}/classificados/${id}/anexo/visualizar`,
      );

      setPreviewFiles(response.data.imagens);
      setModalPreviewAberto(true);
    } catch (error) {
      notify.showError(`Erro ao visualizar o anexo: ${error.message}`);
    }
  };

  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Classificados',
      key: 'classificados',
      path: '/classificados',
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let dadosAPI;
      if (searchValue) {
        dadosAPI = await ServicoClassificado.buscarPorTitulo(
          searchValue,
          rowsPerPage,
          page + 1,
        );
      } else {
        dadosAPI = await ServicoClassificado.listarClassificados(rowsPerPage, page + 1);
      }
      setCount(dadosAPI.count || dadosAPI.length);
      setClassificados(dadosAPI.rows || dadosAPI);
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
              <TableCell>Descrição</TableCell>
              <TableCell>Foto_video</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Contato</TableCell>
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
              if (classificados.length > 0) {
                return classificados.map(classificado => (
                  <TableRow key={classificado.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={event =>
                          handleSelectClassificado(event, classificado.id)
                        }
                      />
                    </TableCell>
                    <TableCell className={styles.celula}>{classificado.titulo}</TableCell>
                    <TableCell className={styles.celula}>
                      {classificado.descricao}
                    </TableCell>
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
                    <TableCell className={styles.celula}>
                      {classificado.usuario}
                    </TableCell>
                    <TableCell className={styles.celula}>
                      {classificado.contato}
                    </TableCell>
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
                ));
              }
              return (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhum classificado encontrado
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
          <Button
            color="primary"
            onClick={() => {
              onCloseRemoveClassificado();
            }}
          >
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
      <PreviewModal
        files={previewFiles}
        isOpen={modalPreviewAberto}
        onClose={() => setModalPreviewAberto(false)}
      />
    </Container>
  );
}

export default Classificados;
