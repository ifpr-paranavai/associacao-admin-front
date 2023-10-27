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
  InputLabel,
} from '@material-ui/core';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ServicoTextoModal from '../../servicos/ServicoTextoModal';
import { useNotify } from '../../contextos/Notificacao';
import styles from './estilo.css';

function EditarTextoModal(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();
  const [saving, setSaving] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [corpo, setCorpo] = useState('');

  useEffect(() => {
    if (props.textoModal && props.textoModal.length > 0) {
      setTitulo(props.textoModal[0].titulo);
      setCorpo(props.textoModal[0].corpo);
    }
  }, [props.textoModal]);

  async function EditarTextoModal(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const data = {
        titulo,
        corpo,
      };
      await ServicoTextoModal.atualizarTextoModal(data);
      notify.showSuccess('TextoModal salvo com sucesso!');
      props.fecharFormulario();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
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
        <form autoComplete="off" onSubmit={event => EditarTextoModal(event)}>
          <DialogTitle id="form-dialog-title">Editar TextoModal</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Typography variant="h6" className={styles.title}>
                    Dados do TextoModal
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
                    label="Titulo da TextoModal"
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
                <InputLabel>Corpo</InputLabel>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  style={{ overflow: 'auto' }}
                >
                  <ReactQuill
                    value={corpo}
                    onChange={setCorpo}
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

export default EditarTextoModal;
