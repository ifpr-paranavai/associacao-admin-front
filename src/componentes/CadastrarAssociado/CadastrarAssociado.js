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
import { removeMask } from '../../uteis/string';

import ServicoAssociado from '../../servicos/ServicoAssociado';
import { buscaCEP } from '../../servicos/ServicoCEP';
import { useStyles } from './estilo';
import { useNotify } from '../../contextos/Notificacao';

export default function CadastrarAssociado(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotify();
  const classes = useStyles();
  const numberRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [imagem, setImagem] = useState({ src: '', alt: '' });
  const [nomecompleto, setNomeCompleto] = useState(''); // salvar sobrenome separado
  const [data_nascimento, setDataNascimento] = useState(null);
  const [perfil, setPerfil] = useState('');
  const [cpf, setCPF] = useState('');
  const [rg, setRG] = useState('');
  const [email, setEmail] = useState('');
  const [email_alternativo, setEmailAlternativo] = useState('');
  const [modalidade, setModalidade] = useState('aeromodelismo');
  const [senha, setSenha] = useState('');
  const [tel_celular, setCelular] = useState({ numero: '', whatsapp: false });
  const [tel_residencial, setTelResidencial] = useState('');
  const [tel_comercial, setTelComercial] = useState('');
  const [endereco, setEndereco] = useState({
    cep: '',
    estado: '',
    cidade: '',
    rua: '',
    bairro: '',
    numero: '',
  });

  function setAssociadoState() {
    const { associado } = props;
    const surname = associado.sobrenome ? ` ${associado.sobrenome}` : '';
    setImagem(associado.imagem);
    setNomeCompleto(associado.nome + surname);
    setDataNascimento(associado.data_nascimento);
    setCPF(associado.cpf);
    setRG(associado.rg);
    setEmail(associado.email);
    setEmailAlternativo(associado.email_alternativo);
    setModalidade(associado.modalidade);
    setPerfil(associado.perfil);
    setCelular(associado.tel_celular);
    setTelComercial(associado.tel_comercial);
    setTelResidencial(associado.tel_residencial);
    setEndereco(associado.endereco);
  }

  function limparState() {
    setImagem({ src: '', alt: '' });
    setNomeCompleto('');
    setDataNascimento(null);
    setCPF('');
    setRG('');
    setEmail('');
    setEmailAlternativo('');
    setModalidade('aeromodelismo');
    setSenha('');
    setCelular({ numero: '', whatsapp: false });
    setTelComercial('');
    setTelResidencial('');
    setEndereco({
      cep: '',
      estado: '',
      cidade: '',
      rua: '',
      bairro: '',
      numero: '',
    });
  }

  async function salvarAssociado(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const [nome, sobrenome] = nomecompleto.split(' ');
      const data = {
        imagem,
        nome,
        sobrenome,
        data_nascimento,
        rg,
        cpf,
        email,
        email_alternativo,
        modalidade,
        perfil,
        senha: md5(senha),
        tel_celular,
        tel_comercial,
        tel_residencial,
        endereco,
        ativo: true,
      };
      if (props.associado?._id) {
        await ServicoAssociado.atualizarAssociado({
          _id: props.associado._id,
          ...data,
        });
      } else {
        await ServicoAssociado.cadastrarAssociado(data);
      }
      notify.showSuccess('Associado salvo com sucesso!');
      setTimeout(() => {
        props.onSave();
      }, 60);
      limparState();
    } catch (error) {
      notify.showError(error.response.data);
    } finally {
      setSaving(false);
    }
  }

  async function findAddress() {
    try {
      setSearching(true);
      const unmaskedCEP = removeMask(endereco.cep);
      const address = await buscaCEP(unmaskedCEP);

      setEndereco({
        ...endereco,
        estado: address.state,
        cidade: address.city,
        bairro: address.neighborhood,
        rua: address.street,
      });

      setTimeout(() => {
        numberRef.current?.focus();
      }, 120);
    } catch (error) {
      notify.showError(error.response.data);
    } finally {
      setSearching(false);
    }
  }

  useEffect(() => {
    if (!props.associado) {
      return;
    }
    setAssociadoState();
  }, [props.associado]);

  useEffect(() => {
    if (!endereco.cep || endereco.cep.length < 9) {
      return;
    }
    findAddress();
  }, [endereco.cep]);

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.fecharFormulario}
        aria-labelledby="form-dialog-title"
        maxWidth="800px"
        fullScreen={isMobile}
      >
        <form autoComplete="off" onSubmit={event => salvarAssociado(event)}>
          <DialogTitle id="form-dialog-title">Cadastrar Associado</DialogTitle>
          <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
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
                    Dados do associado
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <ImageUploader
                  image={imagem}
                  className={classes.fieldMargin}
                  onUpload={image => setImagem(image)}
                />
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

              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  className={classes.fieldMargin}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Perfil de acesso
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={perfil}
                    label="Perfil de acesso"
                    onChange={event => setPerfil(event.target.value)}
                  >
                    <MenuItem value="Associado">Associado</MenuItem>
                    <MenuItem value="Diretoria">Diretoria</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 8}>
                <TextField
                  autoFocus // para iniciar com o cursor no campo
                  value={nomecompleto}
                  label="Nome completo"
                  type="text"
                  className={classes.fieldMargin}
                  fullWidth
                  required
                  variant="outlined"
                  onChange={event => setNomeCompleto(event.target.value)}
                />
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
                    value={data_nascimento}
                    onChange={value => setDataNascimento(value)}
                    helperText=""
                    KeyboardButtonProps={{
                      'aria-label': 'Escolha uma data',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <InputMask
                  mask="99.999.999-9"
                  value={rg}
                  maskChar={null}
                  onChange={event => setRG(event.target.value)}
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

              <Grid item xs={isMobile ? 12 : 6}>
                <InputMask
                  mask="999.999.999-99"
                  value={cpf}
                  maskChar={null}
                  onChange={event => setCPF(event.target.value)}
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
                  value={email_alternativo}
                  label="Email alternativo"
                  type="email"
                  className={classes.fieldMargin}
                  fullWidth
                  variant="outlined"
                  onChange={event => setEmailAlternativo(event.target.value)}
                />
              </Grid>

              <Grid item xs={isMobile ? 12 : 6}>
                <FormControl
                  className={clsx(classes.margin, classes.fieldMargin)}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    required={!props.associado || !props.associado._id}
                    htmlFor="outlined-adornment-password"
                  >
                    Senha
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    value={senha}
                    type={showPassword ? 'text' : 'password'}
                    required={!props.associado || !props.associado._id}
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

              <Grid item xs={isMobile ? 12 : 6}>
                <FormControl variant="outlined" required fullWidth>
                  <InputLabel htmlFor="outlined-adornment-celular">
                    {tel_celular.whatsapp ? 'WhatsApp' : 'Celular'}
                  </InputLabel>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={tel_celular.numero}
                    maskChar={null}
                    onChange={event =>
                      setCelular({ ...tel_celular, numero: event.target.value })
                    }
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
                                  checked={tel_celular.whatsapp}
                                  size="small"
                                  onChange={() =>
                                    setCelular({
                                      ...tel_celular,
                                      whatsapp: !tel_celular.whatsapp,
                                    })
                                  }
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
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-celular">
                    Telefone residencial
                  </InputLabel>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={tel_residencial}
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
                    value={tel_comercial}
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
                  value={endereco.cep}
                  disabled={searching}
                  maskChar={null}
                  onChange={event =>
                    setEndereco({ ...endereco, cep: event.target.value })
                  }
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
                  value={endereco.rua}
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
                  onChange={event =>
                    setEndereco({ ...endereco, rua: event.target.value })
                  }
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
                  value={endereco.numero}
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
                  onChange={event =>
                    setEndereco({ ...endereco, numero: event.target.value })
                  }
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
                  value={endereco.bairro}
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
                  onChange={event =>
                    setEndereco({ ...endereco, bairro: event.target.value })
                  }
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
                  value={endereco.estado}
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
                  onChange={event =>
                    setEndereco({ ...endereco, estado: event.target.value })
                  }
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
                  value={endereco.cidade}
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
                  onChange={event =>
                    setEndereco({ ...endereco, cidade: event.target.value })
                  }
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
            <div className={classes.wrapper}>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                Salvar
              </Button>
              {saving && (
                <CircularProgress size={24} className={classes.buttonProgress} />
              )}
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
