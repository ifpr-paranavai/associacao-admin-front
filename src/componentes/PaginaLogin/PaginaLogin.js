import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  Grid,
  Box,
  Paper,
  Avatar,
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  Button,
  FormControl,
  CircularProgress,
  Link,
} from '@material-ui/core';

import clsx from 'clsx';
import { useStyles } from './estilo';
import { useNotify } from '../../contextos/Notificacao';
import ServicoAutenticacao from '../../servicos/ServicoAutenticacao';
import LogoBlack from '../../assets/logo-black.png';

export default function PaginaLogin() {
  const classes = useStyles();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
    senha: '',
    mostrarSenha: false,
  });

  const logar = async event => {
    event.preventDefault();
    try {
      setLoading(true);
      const Servico = new ServicoAutenticacao();
      await Servico.logar(values);

      window.location.replace('/admin/');
    } catch (e) {
      notify.showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, mostrarSenha: !values.mostrarSenha });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <Box className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form autoComplete="off" onSubmit={logar}>
          <Grid align="center" style={{ marginBottom: '24px' }}>
            <img src={LogoBlack} alt="Logo Amaer" width="300px" />
          </Grid>
          <h2 style={{ margin: '14px 0' }}>Autenticação</h2>
          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            required
            value={values.email}
            onChange={handleChange('email')}
          />
          <div style={{ height: 20 }} />
          <FormControl className={clsx(classes.margin)} variant="outlined" fullWidth>
            <InputLabel required htmlFor="outlined-adornment-password">
              Senha
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.mostrarSenha ? 'text' : 'password'}
              value={values.senha}
              required
              onChange={handleChange('senha')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.mostrarSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
            <Link href="/recuperar-senha">Recuperar Senha</Link>
          </FormControl>
          <div style={{ height: 20 }} />
          <div className={classes.wrapper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Entrar
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </form>
      </Paper>
    </Box>
  );
}
