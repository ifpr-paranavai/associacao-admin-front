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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import InputMask from 'react-input-mask';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import md5 from 'md5';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';
import Axios from 'axios';
import ImageUploader from '../ImageUploader/ImageUploader';
import Config from '../../uteis/configuracao';
import ServicoEvento from '../../servicos/ServicoEvento';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function CadastrarEvento(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const numberRef = useRef(null);
  const notify = useNotify();

  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

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
    // Conversor de datas
    const dataInicioDoBanco = evento.data_inicio;
    const dataFimDoBanco = evento.data_fim;
    const dataInicioFormatada = dataInicioDoBanco ? dataInicioDoBanco.slice(0, 10) : '';
    const dataFimFormatada = dataFimDoBanco ? dataFimDoBanco.slice(0, 10) : '';

    setDataInicio(dataInicioFormatada);
    setDataFim(dataFimFormatada);
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
    setDataInicio('');
    setDataFim('');
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
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DesktopDatePicker
                    maxDate={dayjs(data_fim)}
                    defaultValue={dayjs(data_inicio)}
                    onChange={value => setDataInicio(value)}
                    required
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <InputLabel>Data de encerramento</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DesktopDatePicker
                    minDate={dayjs(data_inicio)}
                    defaultValue={dayjs(data_fim)}
                    required
                    onChange={value => setDataFim(value)}
                  />
                </LocalizationProvider>
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
