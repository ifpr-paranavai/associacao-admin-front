import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';

import { useStyles } from './estilo';

export default function CadastrarAssociado(props) {
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
    numero: 0,
  });

  const classes = useStyles();

  useEffect(() => {
    console.log(data_nascimento)
  }, [data_nascimento]);

  return (
    <div>
      <Dialog open={props.open} onClose={props.fecharFormulario} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Cadastrar Associado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Texto de inscrição
          </DialogContentText>
          <TextField
            autoFocus // para iniciar com o cursor no campo
            value={nomecompleto}
            label="Nome completo"
            type="text"
            fullWidth
            onChange={event => setNomeCompleto(event.target.value)}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              label="Data de nascimento"
              style={{ width: '100%', margin: '0px', padding: '0px' }}
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
            fullWidth
            onChange={event => setRG(event.target.value)}
          />
          <TextField
            value={cpf}
            label="CPF"
            type="text"
            fullWidth
            onChange={event => setCPF(event.target.value)}
          />
          <TextField
            value={email}
            label="Email"
            type="email"
            fullWidth
            onChange={event => setEmail(event.target.value)}
          />
          <TextField
            value={email_alternativo}
            label="Email alternativo"
            type="email"
            fullWidth
            onChange={event => setEmailAlternativo(event.target.value)}
          />
          <FormControl className={clsx(classes.margin, classes.textField)}>
            <InputLabel htmlFor="standard-adornment-password">Senha</InputLabel>
            <Input
              value={senha}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Ver senha"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={event => setSenha(event.target.value)}
            />
          </FormControl>
          <TextField
            value={modalidade}
            label="Modalidade"
            type="text"
            fullWidth
            onChange={event => setModalidade(event.target.value)}
          />
          <TextField
            value={tel_celular.numero}
            label={tel_celular.whatsapp ? 'WhatsApp' : 'Celular'}
            type="phone"
            fullWidth
            // Mantém whatsapp e sobrescreve o número dentro do objeto tel_celular
            onChange={event => setCelular({ ...tel_celular, numero: event.target.value })}
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
