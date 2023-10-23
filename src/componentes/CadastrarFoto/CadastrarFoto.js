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
import ServicoFoto from '../../servicos/ServicoFoto';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function CadastrarFoto(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();
  const [saving, setSaving] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [link, setLink] = useState('');

  function setFotostate() {
    const { Foto } = props;
    setTitulo(Foto.titulo);
    setLink(Foto.link);
  }

  async function salvarFoto(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        titulo,
        link,
      };
      let idFoto;
      if (props.Foto?.id) {
        await ServicoFoto.atualizarFoto(data, props.Foto.id);
        idFoto = props.Foto.id;
      } else {
        const novoFoto = await ServicoFoto.cadastrarFoto(data);
        idFoto = novoFoto.id;
      }
      notify.showSuccess('Foto salvo com sucesso!');
      props.fecharFormulario();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!props.Foto) {
      return;
    }
    setFotostate();
  }, [props.Foto]);

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
        <form autoComplete="off" onSubmit={event => salvarFoto(event)}>
          <DialogTitle id="form-dialog-title">Cadastrar Foto</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="h6" className={styles.title}>
                    Dados do Foto
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
                    label="Titulo da Foto"
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
                    value={link}
                    label="link da Foto (Google Drive)"
                    type="text"
                    className={styles.fieldMargin}
                    fullWidth
                    required
                    variant="outlined"
                    onChange={event => setLink(event.target.value)}
                  />
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
