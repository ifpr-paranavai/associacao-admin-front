import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  FormControl,
  IconButton,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Typography,
  Box,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Visibility, VisibilityOff, Person, Phone, Home } from '@material-ui/icons';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';

import ImageUploader from '../ImageUploader/ImageUploader';
import { useStyles } from './estilo';

export default function CadastrarAssociado(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [showPassword, setShowPassword] = useState(false);

  const [imagem, setImagem] = useState({ src: '',  alt: '' });
  const [nomecompleto, setNomeCompleto] = useState(''); // salvar sobrenome separado
  const [data_nascimento, setDataNascimento] = useState(null);
  const [cpf, setCPF] = useState('');
  const [rg, setRG] = useState('');
  const [email, setEmail] = useState('');
  const [email_alternativo, setEmailAlternativo] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [senha, setSenha] = useState('');
  const [tel_celular, setCelular] = useState({ numero: '', whatsapp: false });
  const [endereco, setEndereco] = useState({
    cep: '',
    estado: '', 
    cidade: '', 
    rua: '',
    bairro: '',
    numero: '',
  });

  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.fecharFormulario}
        aria-labelledby="form-dialog-title"
        maxWidth="800px"
        fullScreen={isMobile}
      >
        <DialogTitle id="form-dialog-title">Cadastrar Associado</DialogTitle>
        <DialogContent style={{ width: '100%', maxWidth: '800px' }}>
          <DialogContentText>
            Texto de inscrição
          </DialogContentText>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Person
              style={{ width: '40px', height: '40px', marginRight: '12px' }}
              color="primary"
            />
            <Typography
              variant="h6"
              className={classes.title}
            >
              Dados do associado
            </Typography>
          </Box>
          <ImageUploader
            image={imagem}
            className={classes.fieldMargin}
            onUpload={image => setImagem(image)}
          />
          <RadioGroup
            aria-label="Modalidade"
            row
            value={modalidade}
            className={classes.fieldMargin}
            onChange={event => setModalidade(event.target.value)}
          >
            <FormLabel
              component="legend"
              style={{ width: '100%' }}
            >
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
          <TextField
            autoFocus // para iniciar com o cursor no campo
            value={nomecompleto}
            label="Nome completo"
            type="text"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            onChange={event => setNomeCompleto(event.target.value)}
          />
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
          >
            <KeyboardDatePicker
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="Data de nascimento"
              inputVariant="outlined"
              className={classes.fieldMargin}
              style={{ width: '100%', padding: '0px' }}
              value={data_nascimento}
              onChange={value => setDataNascimento(value)}
              KeyboardButtonProps={{
                'aria-label': 'Escolha uma data',
              }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            value={rg}
            label="RG"
            type="text"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            onChange={event => setRG(event.target.value)}
          />
          <TextField
            value={cpf}
            label="CPF"
            type="text"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            onChange={event => setCPF(event.target.value)}
          />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={classes.fieldMargin}
          >
            <Phone
              style={{ width: '40px', height: '40px', marginRight: '12px' }}
              color="primary"
            />
            <Typography
              variant="h6"
              className={classes.title}
            >
              Dados de contato
            </Typography>
          </Box>
          <TextField
            value={email}
            label="Email"
            type="email"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            onChange={event => setEmail(event.target.value)}
          />
          <TextField
            value={email_alternativo}
            label="Email alternativo"
            type="email"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            onChange={event => setEmailAlternativo(event.target.value)}
          />
          <FormControl
            className={clsx(classes.margin, classes.fieldMargin)}
            variant="outlined"
            fullWidth
          >
            <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={senha}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              labelWidth={48}
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
          <TextField
            value={tel_celular.numero}
            label={tel_celular.whatsapp ? 'WhatsApp' : 'Celular'}
            type="phone"
            inputMode="tel"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            // Mantém whatsapp e sobrescreve o número dentro do objeto tel_celular
            onChange={event => setCelular({ ...tel_celular, numero: event.target.value })}
          />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={classes.fieldMargin}
          >
            <Home
              style={{ width: '40px', height: '40px', marginRight: '12px' }}
              color="primary"
            />
            <Typography
              variant="h6"
              className={classes.title}
            >
              Endereço
            </Typography>
          </Box>
          <TextField
            value={endereco.cep}
            label="CEP"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            // Mantém whatsapp e sobrescreve o cep dentro do objeto endereco
            onChange={event => setEndereco({ ...endereco, cep: event.target.value })}
          />
          <TextField
            value={endereco.rua}
            label="Rua"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            // Mantém whatsapp e sobrescreve o rua dentro do objeto endereco
            onChange={event => setEndereco({ ...endereco, rua: event.target.value })}
          />
          <TextField
            value={endereco.numero}
            label="Número"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            // Mantém whatsapp e sobrescreve o numero dentro do objeto endereco
            onChange={event => setEndereco({ ...endereco, numero: event.target.value })}
          />
          <TextField
            value={endereco.bairro}
            label="Bairro"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            // Mantém whatsapp e sobrescreve o bairro dentro do objeto endereco
            onChange={event => setEndereco({ ...endereco, bairro: event.target.value })}
          />
          <TextField
            value={endereco.cidade}
            label="Cidade"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            // Mantém whatsapp e sobrescreve o cidade dentro do objeto endereco
            onChange={event => setEndereco({ ...endereco, cidade: event.target.value })}
          />
          <TextField
            value={endereco.estado}
            label="Estado"
            className={classes.fieldMargin}
            fullWidth
            variant="outlined"
            // Mantém whatsapp e sobrescreve o estado dentro do objeto endereco
            onChange={event => setEndereco({ ...endereco, estado: event.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.fecharFormulario} color="primary">
            Cancel
          </Button>
          <Button onClick={props.fecharFormulario} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
