import React, { useEffect, useState } from 'react';

import {
  Box,
  CardContent,
  Card,
  Typography,
  Avatar,
  Button,
  LinearProgress,
  CircularProgress,
} from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';
import { useNotify } from '../../contextos/Notificacao';
import { useStyles } from './estilo';
import ServicoAssociado from '../../servicos/ServicoAssociado';

const AssociadosPendentes = () => {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState([]);
  const [accepting, setAccepting] = useState([]);
  const notify = useNotify();

  async function loadPendings() {
    try {
      setLoading(true);
      const associados = await ServicoAssociado.obterPendentes();
      setPendentes(associados);
    } catch (error) {
      notify.showError(error.response.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(associado) {
    try {
      const data = {
        ...associado,
        ativo: true,
      };
      await ServicoAssociado.atualizarAssociado(data, associado.id);
      loadPendings();
    } catch (error) {
      notify.showError('Falha ao aceitar associado');
    }
  }

  async function handleRemove(associado) {
    try {
      await ServicoAssociado.deletarAssociado(associado.id);
      loadPendings();
    } catch (error) {
      notify.showError('Falha ao deletar pendente');
    }
  }

  useEffect(() => {
    loadPendings();
  }, []);

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      {!loading && <div className={classes.mockProgressBar} />}
      {loading && <div className={classes.loading} />}
      {loading && <LinearProgress />}
      <CardContent style={{ position: 'relative' }}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          paddingBottom="8px"
          borderBottom="1px solid #1976d2"
        >
          <Typography variant="h6" color="primary">
            Associados pendentes
          </Typography>
        </Box>
        {pendentes.map(associado => (
          <Box
            key={associado._id}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginTop="14px"
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              marginRight="12px"
            >
              <Avatar
                alt="Teste"
                src={associado.imagem && associado.imagem.src}
                style={{ marginRight: '10px', width: '32px', height: '32px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  <span style={{ marginRight: '3px' }}>{associado.nome}</span>
                  {associado.sobrenome && <span>{associado.sobrenome}</span>}
                </div>

                <span style={{ fontSize: '12px' }}>{associado.email}</span>
              </div>
            </Box>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative', marginRight: '12px' }}>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    borderColor: '#8c8c8c',
                    color: '#8c8c8c',
                  }}
                  onClick={() => handleRemove(associado)}
                >
                  <Delete fontSize="small" htmlColor="#8c8c8c" />
                  Excluir
                </Button>

                {removing.includes(associado._id) && (
                  <CircularProgress
                    size={20}
                    color="primary"
                    thickness={4}
                    className={classes.buttonProgress}
                  />
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={accepting.includes(associado._id)}
                  style={{ borderColor: '#009933', color: '#009933' }}
                  onClick={() => handleAccept(associado)}
                >
                  <Check fontSize="small" htmlColor="#009933" />
                  Aceitar
                </Button>

                {accepting.includes(associado._id) && (
                  <CircularProgress
                    size={20}
                    color="primary"
                    thickness={4}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </div>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default AssociadosPendentes;
