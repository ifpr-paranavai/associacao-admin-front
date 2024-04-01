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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import 'date-fns';
import Axios from 'axios';
import Config from '../../uteis/configuracao';
import ServicoNoticia from '../../servicos/ServicoNoticia';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function CadastrarNoticia(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();
  const [saving, setSaving] = useState(false);
  const [anexo, setAnexo] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data_inicio, setDataInicio] = useState('');
  const { fecharFormulario, onSave } = props;

  function setNoticiaState() {
    const { noticia } = props;
    setTitulo(noticia.titulo);
    setDescricao(noticia.descricao);
    // Conversor de datas
    const dataInicioDoBanco = noticia.data_inicio;
    const dataInicioFormatada = dataInicioDoBanco ? dataInicioDoBanco.slice(0, 10) : '';
    setDataInicio(dataInicioFormatada);
  }

  async function salvarNoticia(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        titulo,
        descricao,
        data_inicio,
      };
      let idNoticia;
      if (props.noticia?.id) {
        await ServicoNoticia.atualizarNoticia(
          data,
          props.noticia.id, // passando o ID para a url
        );
        idNoticia = props.noticia.id;
      } else {
        const novoNoticia = await ServicoNoticia.cadastrarNoticia(data);
        idNoticia = novoNoticia.id;
      }
      // lógica para lidar com o upload de anexos aqui
      if (anexo) {
        await ServicoNoticia.uploadAnexo(idNoticia, anexo);
      }
      notify.showSuccess('Noticia salva com sucesso!');
      props.fecharFormulario();
      limparAnexo();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!props.noticia) {
      return;
    }
    setNoticiaState();
  }, [props.noticia]);

  function limparAnexo() {
    setAnexo(null);
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          props.fecharFormulario();
        }}
        aria-labelledby="form-dialog-title"
        maxWidth="800px"
        fullScreen={isMobile}
      >
        <form autoComplete="off" onSubmit={event => salvarNoticia(event)}>
          <DialogTitle id="form-dialog-title">Cadastrar Noticia</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="h6" className={styles.title}>
                    Dados do noticia
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
                      *Somente imagens
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
                    label="Titulo do noticia"
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
                <InputLabel>Descrição</InputLabel>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  style={{ overflow: 'auto' }}
                >
                  <ReactQuill
                    value={descricao}
                    onChange={setDescricao}
                    modules={{
                      toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }, { size: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        [{ align: [] }],
                        ['clean'],
                      ],
                    }}
                    formats={[
                      'header',
                      'list',
                      'bold',
                      'italic',
                      'underline',
                      'link',
                      'align',
                      'font',
                      'size',
                    ]}
                    placeholder="Digite aqui..."
                    style={{ height: 'auto' }} // Defina a altura para automático
                  />
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <InputLabel>Data da notícia</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DesktopDatePicker
                    defaultValue={dayjs(data_inicio)}
                    onChange={value => setDataInicio(value)}
                    required
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
                props.fecharFormulario();
                limparAnexo();
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

export default CadastrarNoticia;
