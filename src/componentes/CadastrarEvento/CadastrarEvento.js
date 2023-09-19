import React, { useEffect, useState } from 'react';
import {
  FormControl,
  TextField,
  InputLabel,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import 'date-fns';
import Axios from 'axios';
import Config from '../../uteis/configuracao';
import ServicoEvento from '../../servicos/ServicoEvento';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function CadastrarEvento(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();

  const [saving, setSaving] = useState(false);

  const [anexo, setAnexo] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [local, setLocal] = useState('');
  const [data_inicio, setDataInicio] = useState(null);
  const [data_fim, setDataFim] = useState(null);

  function setEventoState() {
    const { evento } = props;
    setTitulo(evento.titulo);
    setDescricao(evento.descricao);
    setLink(evento.link);
    setLocal(evento.local);
    setDataInicio(evento.data_inicio);
    setDataFim(evento.data_fim);
  }

  async function salvarEvento(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        titulo,
        descricao,
        link,
        local,
        data_inicio,
        data_fim,
        ativo: true,
      };
      let idEvento;
      if (props.evento?.id) {
        await ServicoEvento.atualizarEvento(
          data,
          props.evento.id, // passando o ID para a url
        );
        idEvento = props.evento.id;
      } else {
        const novoEvento = await ServicoEvento.cadastrarEvento(data);
        idEvento = novoEvento.id;
      }
      if (anexo) {
        const formData = new FormData();
        formData.append('anexo', anexo);
        await Axios.post(`${Config.api}/eventos/${idEvento}/anexo`, formData);
      }
      notify.showSuccess('Evento salvo com sucesso!');
      limparState();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!props.evento) {
      return;
    }
    setEventoState();
  }, [props.evento]);

  function limparState() {
    setTitulo('');
    setDescricao('');
    setLink('');
    setLocal('');
    setDataInicio(null);
    setDataFim(null);
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          props.fecharFormulario();
          limparState();
        }}
        aria-labelledby="form-dialog-title"
        maxWidth="800px"
        fullScreen={isMobile}
      >
        <form autoComplete="off" onSubmit={event => salvarEvento(event)}>
          <DialogTitle id="form-dialog-title">Cadastrar Evento</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="h6" className={styles.title}>
                    Dados do evento
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth className={styles.fieldMargin}>
                  <input
                    accept=".png,.jpg,.jpeg" // aceita apenas imagens
                    style={{ display: 'none' }}
                    id="anexo-upload"
                    type="file"
                    onChange={event => {
                      const file = event.target.files[0];
                      setAnexo(file); // Armazena o arquivo selecionado no estado 'anexo'
                    }}
                  />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="anexo-upload">
                    <Button variant="contained" color="primary" component="span">
                      Selecionar Anexo
                    </Button>
                    <span style={{ marginLeft: '10px', color: 'red' }}>
                      *Somente Video e imagens
                    </span>
                  </label>
                  {anexo && (
                    <Typography variant="body1" className={styles.fileLabel}>
                      {anexo.name}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={styles.fieldMargin}
                >
                  <TextField
                    autoFocus // para iniciar com o cursor no campo
                    value={titulo}
                    label="Titulo do evento"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    required
                    variant="outlined"
                    onChange={event => setTitulo(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={styles.fieldMargin}
                >
                  <TextField
                    autoFocus // para iniciar com o cursor no campo
                    value={descricao}
                    label="Descrição do evento"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    variant="outlined"
                    onChange={event => setDescricao(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={styles.fieldMargin}
                >
                  <TextField
                    autoFocus // para iniciar com o cursor no campo
                    value={link}
                    label="Link do evento"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    variant="outlined"
                    onChange={event => setLink(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={styles.fieldMargin}
                >
                  <TextField
                    autoFocus // para iniciar com o cursor no campo
                    value={local}
                    label="Local do evento"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    variant="outlined"
                    onChange={event => setLocal(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <InputLabel>Data de inicio</InputLabel>
                <TextField
                  type="datetime-local"
                  value={data_inicio}
                  required
                  className={styles.fieldMargin}
                  fullWidth
                  variant="outlined"
                  onChange={event => setDataInicio(event.target.value)}
                />
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <InputLabel>Data de encerramento</InputLabel>
                <TextField
                  type="datetime-local"
                  value={data_fim}
                  required
                  className={styles.fieldMargin}
                  fullWidth
                  variant="outlined"
                  onChange={event => setDataFim(event.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ padding: '16px' }}>
            <Button
              color="primary"
              style={{ marginRight: '12px' }}
              disabled={saving}
              onClick={() => {
                limparState();
                props.fecharFormulario();
                window.location.reload();
              }}
            >
              Cancelar
            </Button>
            <div className={styles.wrapper}>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                Salvar
              </Button>
              {saving && <CircularProgress size={24} className={styles.buttonProgress} />}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default CadastrarEvento;
