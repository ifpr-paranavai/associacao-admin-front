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
import ServicoClassificado from '../../servicos/ServicoClassificado';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function CadastrarClassificado(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const numberRef = useRef(null);
  const notify = useNotify();

  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);

  const [imagem, setImagem] = useState({ src: '', alt: '' });
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto_video, setFoto_video] = useState('');
  const [preco, setPreco] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contato, setContato] = useState('');

  function setClassificadoState() {
    const { classificado } = props;
    setImagem(classificado.imagem);
    setTitulo(classificado.titulo);
    setDescricao(classificado.descricao);
    setFoto_video(classificado.foto_video);
    setPreco(classificado.preco);
    setUsuario(classificado.usuario);
    setContato(classificado.contato);
  }

  async function salvarClassificado(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        imagem,
        titulo,
        descricao,
        foto_video,
        preco,
        usuario,
        contato,
      };
      if (props.classificado?.id) {
        await ServicoClassificado.atualizarClassificado(
          data,
          props.classificado.id, // passando o ID para a url
        );
      } else {
        await ServicoClassificado.cadastrarClassificado(data);
      }
      notify.showSuccess('Classificado salvo com sucesso!');
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
    if (!props.classificado) {
      return;
    }
    setClassificadoState();
  }, [props.classificado]);

  function limparState() {
    setImagem({ src: '', alt: '' });
    setTitulo('');
    setDescricao('');
    setFoto_video('');
    setPreco('');
    setUsuario('');
    setContato('');
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
        <form autoComplete="off" onSubmit={event => salvarClassificado(event)}>
          <DialogTitle id="form-dialog-title">Cadastrar Classificado</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="h6" className={styles.title}>
                    Dados do classificado
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
                    label="Titulo do classificado"
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
                    label="Descrição do classificado"
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
                    value={foto_video}
                    label="Imagem/video do classificado"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    variant="outlined"
                    onChange={event => setFoto_video(event.target.value)}
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
                    value={preco}
                    label="Preço"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    variant="outlined"
                    onChange={event => setPreco(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <InputLabel>Usuario</InputLabel>
                <TextField
                  type="text"
                  value={usuario}
                  required
                  className={styles.fieldMargin}
                  fullWidth
                  variant="outlined"
                  onChange={event => setUsuario(event.target.value)}
                />
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <InputLabel>Contato</InputLabel>
                <TextField
                  type="text"
                  value={contato}
                  required
                  className={styles.fieldMargin}
                  fullWidth
                  variant="outlined"
                  onChange={event => setContato(event.target.value)}
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

export default CadastrarClassificado;
