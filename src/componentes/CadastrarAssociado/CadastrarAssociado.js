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
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [telCelular, setTelCelular] = useState('');
  const [whatsapp, setWhatsapp] = useState(false);
  const [telComercial, setTelComercial] = useState('');
  const [telResidencial, setTelResidencial] = useState('');
  const [email, setEmail] = useState('');
  const [emailAlternativo, setEmailAlternativo] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [ativo, setAtivo] = useState('');

  const { associado, fecharFormulario, onSave } = props;

  useEffect(() => {
    if (associado) {
      setNome(associado.nome || '');
      setSobrenome(associado.sobrenome || '');
      setDataNascimento(associado.data_nascimento || '');
      setCpf(associado.cpf || '');
      setRg(associado.rg || '');
      setTelCelular(associado.tel_celular || '');
      setWhatsapp(!!associado.whatsapp); // Converte para booleano
      setTelComercial(associado.tel_comercial || '');
      setTelResidencial(associado.tel_residencial || '');
      setEmail(associado.email || '');
      setEmailAlternativo(associado.email_alternativo || '');
      setCep(associado.cep || '');
      setRua(associado.rua || '');
      setNumero(associado.numero || '');
      setBairro(associado.bairro || '');
      setEstado(associado.estado || '');
      setCidade(associado.cidade || '');
      setAtivo(associado.ativo || false);
    }
  }, [associado]);

  const limparState = () => {
    setNome('');
    setSobrenome('');
    setDataNascimento('');
    setCpf('');
    setRg('');
    setTelCelular('');
    setWhatsapp(false);
    setTelComercial('');
    setTelResidencial('');
    setEmail('');
    setEmailAlternativo('');
    setCep('');
    setRua('');
    setNumero('');
    setBairro('');
    setEstado('');
    setCidade('');
    setAtivo(false);
  };

  const salvarAssociado = async event => {
    event.preventDefault();
    try {
      const associadoData = {
        nome,
        sobrenome,
        data_nascimento: dataNascimento,
        cpf,
        rg,
        tel_celular: telCelular,
        whatsapp,
        tel_comercial: telComercial,
        tel_residencial: telResidencial,
        email,
        email_alternativo: emailAlternativo,
        cep,
        rua,
        numero,
        bairro,
        estado,
        cidade,
        ativo: false,
      };

      if (associado.id) {
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
        }}
        aria-labelledby="form-dialog-title"
        maxWidth="800px"
      >
        <form
          autoComplete="off"
          onSubmit={salvarAssociado}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DialogContent
            style={{
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
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <TextField
                  autoFocus
                  value={nome}
                  label="Nome do associado"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setNome(event.target.value)}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={sobrenome}
                  label="Sobrenome do associado"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setSobrenome(event.target.value)}
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
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={dataNascimento}
                  type="date"
                  required
                  variant="outlined"
                  onChange={event => setDataNascimento(event.target.value)}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={cpf}
                  label="CPF"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setCpf(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                width: '100%',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={rg}
                  label="RG"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setRg(event.target.value)}
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
                display: 'flex',
                marginBottom: '10px',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={telCelular}
                  label="Telefone celular"
                  type="text"
                  variant="outlined"
                  onChange={event => setTelCelular(event.target.value)}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <FormControlLabel
                  value={whatsapp}
                  control={<Switch color="primary" />}
                  label="Whatsapp"
                  onChange={event => setWhatsapp(event.target.value)}
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
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={telComercial}
                  label="Telefone comercial"
                  variant="outlined"
                  onChange={event => setTelComercial(event.target.value)}
                />
              </FormControl>
              <FormControl style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={telResidencial}
                  label="Telefone residêncial"
                  type="text"
                  variant="outlined"
                  onChange={event => setTelResidencial(event.target.value)}
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
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={email}
                  label="Email"
                  variant="outlined"
                  onChange={event => setEmail(event.target.value)}
                />
              </FormControl>
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={emailAlternativo}
                  label="Email alternativo"
                  type="text"
                  variant="outlined"
                  onChange={event => setEmailAlternativo(event.target.value)}
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
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl variant="outlined" style={{ width: '25%', margin: '5px' }}>
                <TextField
                  value={cep}
                  label="CEP"
                  required
                  variant="outlined"
                  onChange={event => setCep(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '65%', margin: '5px' }}
              >
                <TextField
                  value={rua}
                  label="Logradouro"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setRua(event.target.value)}
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
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={numero}
                  label="Numero"
                  required
                  variant="outlined"
                  onChange={event => setNumero(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={bairro}
                  label="Bairro"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setBairro(event.target.value)}
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
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl variant="outlined" style={{ width: '45%', margin: '5px' }}>
                <TextField
                  value={estado}
                  label="Estado"
                  required
                  variant="outlined"
                  onChange={event => setEstado(event.target.value)}
                />
              </FormControl>
              <FormControl
                variant="outlined"
                required
                style={{ width: '45%', margin: '5px' }}
              >
                <TextField
                  value={cidade}
                  label="Cidade"
                  type="text"
                  required
                  variant="outlined"
                  onChange={event => setCidade(event.target.value)}
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
