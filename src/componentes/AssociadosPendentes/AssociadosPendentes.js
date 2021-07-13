import React, { useEffect, useState } from 'react';

import {
  Box,
  CardContent,
  Card,
  Typography,
  Avatar,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';
import ServicoAssociado from '../../servicos/ServicoAssociado';
import { useNotify } from '../../contextos/Notificacao';
import { useStyles } from './estilo';

const AssociadosPendentes = () => {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  async function loadPendings() {
    try {
      setLoading(true);
      const associados = await ServicoAssociado.obterPendentes();
      setPendentes(associados.data);
    } catch (error) {
      notify.showError(error.response.data);
    } finally {
      setLoading(false);
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
              <Button
                variant="outlined"
                size="small"
                style={{ borderColor: '#8c8c8c', color: '#8c8c8c', marginRight: '12px' }}
              >
                <Delete fontSize="small" htmlColor="#8c8c8c" />
                Excluir
              </Button>
              <Button
                variant="outlined"
                size="small"
                style={{ borderColor: '#009933', color: '#009933' }}
              >
                <Check fontSize="small" htmlColor="#009933" />
                Aceitar
              </Button>
            </div>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default AssociadosPendentes;
