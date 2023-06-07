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
import ServicoClassificado from '../../servicos/ServicoClassificado';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

import styles from './estilo.css';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';
import { formatarData } from '../../uteis/formatarData';

function Classificados() {
  const [dados, setDados] = useState([]);
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
        const dadosAPI = await ServicoClassificado.listarClassifcados();
        setDados(dadosAPI);
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
          placeholder="Buscar por nome ou valor"
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
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Adicionar
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Titulo</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Imagem</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map(item => (
              <TableRow key={item.id}>
                <TableCell className={styles.celula}>{item.titulo}</TableCell>
                <TableCell className={styles.celula}>{item.descricao}</TableCell>
                <TableCell className={styles.celula}>{item.imagem}</TableCell>
                <TableCell className={styles.celula}>{item.preco}</TableCell>
                <TableCell className={styles.celula}>{item.contato}</TableCell>
                <TableCell className={styles.celula}>{item.usuario}</TableCell>
                <TableCell className={styles.celula}>
                  {formatarData(item.data_inicio)} - {formatarData(item.data_fim)}
                </TableCell>
                <TableCell className={styles.celula}>
                  <IconButton aria-label="editar">
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="deletar">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Classificados;