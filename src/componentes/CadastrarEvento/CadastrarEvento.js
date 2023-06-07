import React, { useEffect, useState, useRef } from 'react';
import {
  FormLabel,
  FormControl,
  FormControlLabel,
  IconButton,
  TextareaAutosize,
  TextField,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  Button,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Typography,
  Switch,
  LinearProgress,
  Box,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Visibility, VisibilityOff, Person, Phone, Home } from '@material-ui/icons';

import InputMask from 'react-input-mask';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import md5 from 'md5';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';
import ImageUploader from '../ImageUploader/ImageUploader';
import ServicoEvento from '../../servicos/ServicoEvento';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function CadastrarEvento(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const numberRef = useRef(null);
  const notify = useNotify();

  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

  const [imagem, setImagem] = useState({ src: '', alt: '' });
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [local, setLocal] = useState('');
  const [data_inicio, setDataInicio] = useState(null);
  const [data_fim, setDataFim] = useState(null);

  function setEventoState() {
    const { evento } = props;
    setImagem(evento.imagem);
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
        imagem,
        titulo,
        descricao,
        link,
        local,
        data_inicio,
        data_fim,
        ativo: true,
      };
      if (props.evento?.id) {
        await ServicoEvento.atualizarEvento(
          { id: props.evento.id, ...data },
          props.evento.id,
        );
      } else {
        await ServicoEvento.cadastrarEvento(data);
      }
      notify.showSuccess('Evento salvo com sucesso!');
      setTimeout(() => {
        // props.onSave();
      }, 60);
      limparState();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
  }

  function limparState() {
    setImagem({ src: '', alt: '' });
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
        onClose={props.fecharFormulario}
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
                <ImageUploader
                  image={imagem}
                  className={styles.fieldMargin}
                  onUpload={image => setImagem(image)}
                />
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
              onClick={props.fecharFormulario}
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
