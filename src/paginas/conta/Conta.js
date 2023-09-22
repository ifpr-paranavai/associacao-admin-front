import React, { useEffect, useState, useRef } from 'react';
import {
  FormLabel,
  FormControl,
  FormControlLabel,
  IconButton,
  TextField,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  Button,
  Radio,
  RadioGroup,
  Typography,
  Switch,
  LinearProgress,
  Box,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Visibility, VisibilityOff, Person, Phone, Home } from '@material-ui/icons';

import InputMask from 'react-input-mask';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import md5 from 'md5';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';
import { removeMask } from '../../uteis/string';

import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';
import ServicoAssociado from '../../servicos/ServicoAssociado';
import ServicoAutenticacao from '../../servicos/ServicoAutenticacao';
import { buscaCEP } from '../../servicos/ServicoCEP';
import { useStyles } from './estilo';
import { useNotify } from '../../contextos/Notificacao';
import { useNavigation } from '../../contextos/Navegacao';

export default function CadastrarAssociado() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();
  const classes = useStyles();
  const { setLocation } = useNavigation();
  const numberRef = useRef(null);

  const [loadingPage, setLoadingPage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
  const [senha, setSenha] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [ativo, setAtivo] = useState('');
  const [modalidade, setModalidade] = useState('');

  const Autenticacao = new ServicoAutenticacao();
  const logged = Autenticacao.obterAssociadoLogado();

  async function setLoggedData() {
    try {
      setLoadingPage(true);
      const associado = await ServicoAssociado.buscarPorId(logged.id);
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
        setSenha(associado.senha || '');
        setCep(associado.cep || '');
        setRua(associado.rua || '');
        setNumero(associado.numero || '');
        setBairro(associado.bairro || '');
        setEstado(associado.estado || '');
        setCidade(associado.cidade || '');
        setAtivo(associado.ativo || false);
        setModalidade(associado.modalidade || '');
      }
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    setLoggedData();
    setLocation({
      title: 'Minha Conta',
      key: 'minha-conta',
      path: '/minha-conta',
    });
  }, []);

  async function salvarAssociado(event) {
    event.preventDefault();
    try {
      setSaving(true);
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
        ativo,
      };
      if (senha) {
        associadoData.senha = md5(senha);
      }
      await ServicoAssociado.atualizarAssociado(associadoData, logged.id);
      notify.showSuccess('Dados salvos com sucesso!');
    } catch (error) {
      notify.showError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function findAddress() {
    try {
      setSearching(true);
      const unmaskedCEP = removeMask(cep);
      const address = await buscaCEP(unmaskedCEP);

      setRua(address.rua);
      setBairro(address.bairro);
      setEstado(address.estado);
      setCidade(address.cidade);
    } catch (error) {
      notify.showError(error.response.data);
    } finally {
      setSearching(false);
    }
  }

  useEffect(() => {
    if (!cep || cep.length < 9) {
      return;
    }
    findAddress();
  }, [cep]);

  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={classes.wrapper}
      >
        <form autoComplete="off" onSubmit={event => salvarAssociado(event)}>
          <Breadcrumbs useGoBack />
          <div style={{ width: '100%', maxWidth: '1200px', paddingTop: '16px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Person
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '12px',
                    }}
                    color="primary"
                  />
                  <Typography variant="h6" className={classes.title}>
                    Meus dados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  aria-label="Modalidade"
                  row
                  value={modalidade}
                  className={classes.fieldMargin}
                  onChange={event => setModalidade(event.target.value)}
                >
                  <FormLabel component="legend" style={{ width: '100%' }}>
                    Modalidade
                  </FormLabel>
                  <FormControlLabel
                    value="aeromodelismo"
                    control={<Radio color="primary" />}
                    label="Aeromodelismo"
                  />
                  <FormControlLabel
                    value="automodelismo"
                    control={<Radio color="primary" />}
                    label="Automodelismo"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  autoFocus // para iniciar com o cursor no campo
                  value={nome}
                  label="Nome"
                  type="text"
                  className={classes.fieldMargin}
                  fullWidth
                  required
                  variant="outlined"
                  onChange={event => setNome(event.target.value)}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  autoFocus // para iniciar com o cursor no campo
                  value={sobrenome}
                  label="Sobrenome"
                  type="text"
                  className={classes.fieldMargin}
                  fullWidth
                  required
                  variant="outlined"
                  onChange={event => setSobrenome(event.target.value)}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <InputMask
                  mask="999.999.999-99"
                  value={cpf}
                  maskChar={null}
                  onChange={event => setCpf(event.target.value)}
                >
                  {inputProps => (
                    <TextField
                      {...inputProps}
                      label="CPF"
                      type="text"
                      required
                      className={classes.fieldMargin}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                </InputMask>
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <InputMask
                  mask="99.999.999-9"
                  value={rg}
                  maskChar={null}
                  onChange={event => setRg(event.target.value)}
                >
                  {inputProps => (
                    <TextField
                      {...inputProps}
                      label="RG"
                      type="text"
                      required
                      className={classes.fieldMargin}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                </InputMask>
              </Grid>
              <Grid item xs={isMobile ? 12 : 4}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="Data de nascimento"
                    inputVariant="outlined"
                    className={classes.fieldMargin}
                    style={{ width: '100%', padding: '0px' }}
                    required
                    value={dataNascimento}
                    onChange={value => setDataNascimento(value)}
                    helperText=""
                    KeyboardButtonProps={{
                      'aria-label': 'Escolha uma data',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className={classes.fieldMargin}
                >
                  <Phone
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '12px',
                    }}
                    color="primary"
                  />
                  <Typography variant="h6" className={classes.title}>
                    Dados de contato
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-celular">
                    Telefone residencial
                  </InputLabel>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={telResidencial}
                    maskChar={null}
                    onChange={event => setTelResidencial(event.target.value)}
                  >
                    {inputProps => (
                      <OutlinedInput
                        {...inputProps}
                        id="outlined-adornment-celular"
                        type="phone"
                        fullWidth
                        labelWidth={160}
                      />
                    )}
                  </InputMask>
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-celular">
                    Telefone comercial
                  </InputLabel>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={telComercial}
                    maskChar={null}
                    onChange={event => setTelComercial(event.target.value)}
                  >
                    {inputProps => (
                      <OutlinedInput
                        {...inputProps}
                        id="outlined-adornment-celular"
                        type="phone"
                        fullWidth
                        labelWidth={160}
                      />
                    )}
                  </InputMask>
                </FormControl>
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  value={email}
                  label="Email"
                  type="email"
                  required
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  onChange={event => setEmail(event.target.value)}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  value={emailAlternativo}
                  label="Email alternativo"
                  type="email"
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  onChange={event => setEmailAlternativo(event.target.value)}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <FormControl variant="outlined" required fullWidth>
                  <InputLabel htmlFor="outlined-adornment-celular">
                    {whatsapp ? 'WhatsApp' : 'Celular'}
                  </InputLabel>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={telCelular}
                    maskChar={null}
                    onChange={event => setTelCelular(event.target.value)}
                  >
                    {inputProps => (
                      <OutlinedInput
                        {...inputProps}
                        id="outlined-adornment-celular"
                        type="phone"
                        fullWidth
                        endAdornment={
                          <InputAdornment position="end">
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={whatsapp}
                                  size="small"
                                  onChange={event => setWhatsapp(!whatsapp)}
                                  color="primary"
                                />
                              }
                              label="WhatsApp"
                            />
                          </InputAdornment>
                        }
                        labelWidth={80}
                      />
                    )}
                  </InputMask>
                </FormControl>
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <FormControl
                  className={clsx(classes.margin, classes.fieldMargin)}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel required={false} htmlFor="outlined-adornment-password">
                    Senha
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    value={senha}
                    type={showPassword ? 'text' : 'password'}
                    required={false}
                    fullWidth
                    labelWidth={56}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Ver senha"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={event => setSenha(event.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className={classes.fieldMargin}
                >
                  <Home
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '12px',
                    }}
                    color="primary"
                  />
                  <Typography variant="h6" className={classes.title}>
                    Endereço
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={isMobile ? 12 : 4}>
                <InputMask
                  mask="99999-999"
                  value={cep}
                  disabled={searching}
                  maskChar={null}
                  onChange={event => setCep(event.target.value)}
                >
                  {inputProps => (
                    <TextField
                      {...inputProps}
                      label="CEP"
                      type="text"
                      required
                      disabled={searching}
                      className={classes.fieldMargin}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        style: searching
                          ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                          : undefined,
                      }}
                    />
                  )}
                </InputMask>
                {searching && (
                  <LinearProgress
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      height: 2,
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : 8}>
                <TextField
                  value={rua}
                  label="Rua"
                  required
                  disabled={searching}
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: searching
                      ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                      : undefined,
                  }}
                  // Mantém endereco e sobrescreve o rua dentro do objeto endereco
                  onChange={event => setRua(event.target.value)}
                />
                {searching && (
                  <LinearProgress
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      height: 2,
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : 4}>
                <TextField
                  inputRef={numberRef}
                  value={numero}
                  label="Número"
                  required
                  disabled={searching}
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: searching
                      ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                      : undefined,
                  }}
                  // Mantém endereco e sobrescreve o numero dentro do objeto endereco
                  onChange={event => setNumero(event.target.value)}
                />
                {searching && (
                  <LinearProgress
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      height: 2,
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : 8}>
                <TextField
                  value={bairro}
                  label="Bairro"
                  required
                  disabled={searching}
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: searching
                      ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                      : undefined,
                  }}
                  // Mantém endereco e sobrescreve o bairro dentro do objeto endereco
                  onChange={event => setBairro(event.target.value)}
                />
                {searching && (
                  <LinearProgress
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      height: 2,
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  value={estado}
                  label="Estado"
                  required
                  disabled={searching}
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: searching
                      ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                      : undefined,
                  }}
                  // Mantém endereco e sobrescreve o estado dentro do objeto endereco
                  onChange={event => setEstado(event.target.value)}
                />
                {searching && (
                  <LinearProgress
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      height: 2,
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  value={cidade}
                  label="Cidade"
                  required
                  disabled={searching}
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: searching
                      ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                      : undefined,
                  }}
                  // Mantém endereco e sobrescreve o cidade dentro do objeto endereco
                  onChange={event => setCidade(event.target.value)}
                />
                {searching && (
                  <LinearProgress
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      height: 2,
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </div>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            minWidth="100%"
            style={{ paddingTop: '16px' }}
          >
            <div className={classes.wrapper}>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                Salvar
              </Button>
              {saving && (
                <CircularProgress size={24} className={classes.buttonProgress} />
              )}
            </div>
          </Box>
        </form>
        {loadingPage && <div className={classes.pageLoading} />}
        {loadingPage && <CircularProgress size={64} className={classes.buttonProgress} />}
      </Box>
    </div>
  );
}
