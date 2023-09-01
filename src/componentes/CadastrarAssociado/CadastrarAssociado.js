import React, { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { useNotify } from '../../contextos/Notificacao';
import ServicoAssociado from '../../servicos/ServicoAssociado';

function CadastrarAssociado(props) {
  const notify = useNotify();

  const [saving, setSaving] = useState(false);
  const [associadoData, setAssociadoData] = useState({
    numero: '',
    bairro: '',
    rua: '',
    cep: '',
    cidade: '',
    estado: '',
    tel_celular: '',
    whatsapp: '',
    nome: '',
    sobrenome: '',
    data_nascimento: null,
    cpf: '',
    rg: '',
    tel_residencial: '',
    tel_comercial: '',
    email: '',
    email_alternativo: '',
    modalidade: '',
    receber_comunicado: false,
    perfil: '',
    data_cadastro: new Date(),
  });

  const [cpfConfirmacao, setCPFConfirmacao] = useState('');

  const { associado, fecharFormulario, onSave } = props;

  useEffect(() => {
    if (associado) {
      setAssociadoData(associado);
    }
  }, [associado]);

  const limparState = () => {
    setAssociadoData({
      numero: '',
      bairro: '',
      rua: '',
      cep: '',
      cidade: '',
      estado: '',
      tel_celular: '',
      whatsapp: '',
      nome: '',
      sobrenome: '',
      data_nascimento: null,
      cpf: '',
      rg: '',
      tel_residencial: '',
      tel_comercial: '',
      email: '',
      email_alternativo: '',
      modalidade: '',
      receber_comunicado: false,
      perfil: '',
      data_cadastro: new Date(),
    });
  };

  const salvarAssociado = async event => {
    event.preventDefault();
    try {
      setSaving(true);

      if (cpfConfirmacao !== associadoData.cpf) {
        notify.showError('CPF de confirmação não corresponde.');
        setSaving(false);
        return;
      }

      if (associado) {
        await ServicoAssociado.atualizarAssociado(associadoData, associado.id);
      } else {
        await ServicoAssociado.cadastrarAssociado(associadoData);
      }

      notify.showSuccess('Associado salvo com sucesso!');
      limparState();
      onSave();
      fecharFormulario();
    } catch (error) {
      notify.showError(`${error}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Dialog
        open={props.open}
        onClose={() => {
          props.fecharFormulario();
          limparState();
        }}
        aria-labelledby="form-dialog-title"
        maxWidth="800px"
      >
        <form
          autoComplete="off"
          onSubmit={salvarAssociado}
          style={{
            width: '100%',
            minWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <DialogContent
            style={{
              width: '100%',
              minWidth: '800px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <DialogTitle
              id="form-dialog-title"
              style={{
                padding: '0',
                marginBottom: '10px',
              }}
            >
              Dados do associado
            </DialogTitle>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  autoFocus
                  value={associadoData.nome}
                  label="Nome do associado"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.sobrenome}
                  label="Sobrenome do associado"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.data_nascimento}
                  label="Data de nascimento"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.cpf}
                  label="CPF"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                marginBottom: '10px',
              }}
            >
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.rg}
                  label="RG"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <DialogTitle
              id="form-dialog-title"
              style={{
                padding: '0',
                marginBottom: '10px',
              }}
            >
              Contato
            </DialogTitle>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                marginBottom: '10px',
              }}
            >
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={associadoData.tel_celular}
                  label="Telefone celular"
                  type="text"
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <FormControlLabel
                  value={associadoData.whatsapp}
                  control={<Switch color="primary" />}
                  label="Whatsapp"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={associadoData.tel_comercial}
                  label="Telefone comercial"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={associadoData.tel_residencial}
                  label="Telefone residêncial"
                  type="text"
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={associadoData.email}
                  label="Email"
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.email_alternativo}
                  label="Email alternativo"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <DialogTitle
              id="form-dialog-title"
              style={{
                padding: '0',
                marginBottom: '10px',
              }}
            >
              Endereço
            </DialogTitle>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <FormControl
                variant="outlined"
                required
                style={{ width: '25%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.cep}
                  label="CEP"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '65%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.rua}
                  label="Logradouro"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.numero}
                  label="Numero"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.bairro}
                  label="Bairro"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                display: 'flex',
                marginBottom: '10px',
              }}
            >
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.estado}
                  label="Estado"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={associadoData.cidade}
                  label="Cidade"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setAssociadoData(event.target.value)}
                />
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                limparState();
                fecharFormulario();
              }}
            >
              Cancelar
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                Salvar
              </Button>
              {saving && <CircularProgress size={24} style={{ marginLeft: '10px' }} />}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default CadastrarAssociado;
