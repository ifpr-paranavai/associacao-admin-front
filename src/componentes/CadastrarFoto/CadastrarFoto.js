import React, { useEffect, useState } from 'react';
import {
  FormControl,
  TextField,
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
import ServicoFoto from '../../servicos/ServicoFoto';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function CadastrarFoto(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();
  const [saving, setSaving] = useState(false);
  const [anexo, setAnexo] = useState(null);
  const [titulo, setTitulo] = useState('');

  function setFotoState() {
    const { foto } = props;
    setTitulo(foto.titulo);
  }

  async function salvarFoto(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        titulo,
      };
      let idFoto;
      if (props.foto?.id) {
        await ServicoFoto.atualizarFoto(data, props.foto.id);
        idFoto = props.foto.id;
      } else {
        const novoFoto = await ServicoFoto.cadastrarFoto(data);
        idFoto = novoFoto.id;
      }
      // lógica para lidar com o upload de anexos aqui
      if (anexo) {
        const formData = new FormData();
        formData.append('anexo', anexo);
        await Axios.post(`${Config.api}/fotos/${idFoto}/anexo`, formData);
      }
      notify.showSuccess('Foto salvo com sucesso!');
      props.fecharFormulario();
      limparAnexo();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!props.foto) {
      return;
    }
    setFotoState();
  }, [props.foto]);

  function limparAnexo() {
    setAnexo(null);
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          props.fecharFormulario();
          limparAnexo();
        }}
        aria-labelledby="form-dialog-title"
        maxWidth="800px"
        fullScreen={isMobile}
      >
        <form autoComplete="off" onSubmit={event => salvarFoto(event)}>
          <DialogTitle id="form-dialog-title">Cadastrar Foto</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="h6" className={styles.title}>
                    Dados do foto
                  </Typography>
                </Box>
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
                    label="Titulo do foto"
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
                <FormControl variant="outlined" fullWidth className={styles.fieldMargin}>
                  <input
                    accept=".png,.jpg,.jpeg" // aceita apenas imagens e vídeos
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
                      *Somente Imagens
                    </span>
                  </label>
                  {anexo && (
                    <Typography variant="body1" className={styles.fileLabel}>
                      {anexo.name}
                    </Typography>
                  )}
                </FormControl>
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

export default CadastrarFoto;
