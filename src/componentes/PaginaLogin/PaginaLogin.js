import React, { useState } from 'react';
import { AccountCircle, Visibility, VisibilityOff } from '@material-ui/icons';
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
} from '@material-ui/core';

import clsx from 'clsx';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AutenticacaoActions from '../../store/ducks/autenticacao/actions';

import { useStyles } from './estilo';
import { useNotify } from '../../contextos/Notificacao';
import LogoBlack from '../../assets/logo-black.png';

function PaginaLogin(props) {
  const classes = useStyles();
  const notify = useNotify();
  const [values, setValues] = useState({
    email: '',
    senha: '',
    mostrarSenha: false,
  });

  const logar = async event => {
    event.preventDefault();
    try {
      const { auth } = props;
      await auth(values);

      // window.location.replace('/');
    } catch (e) {
      notify.showError(e);
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
          </FormControl>
          <div style={{ height: 40 }} />
          <div className={classes.wrapper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={props.loading}
            >
              Entrar
            </Button>
            {props.loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </form>
      </Paper>
    </Box>
  );
}

const mapStateToProps = ({ autenticacao }) => ({
  loading: autenticacao.loading,
});

const mapDispatchToProps = dispatch => bindActionCreators(AutenticacaoActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PaginaLogin);
