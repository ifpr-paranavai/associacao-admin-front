import React from 'react';
import clsx from 'clsx';
import { useStyles } from './estilo.js';
import {AccountCircle, Visibility, VisibilityOff} from '@material-ui/icons';
import {Grid, Paper, Avatar, TextField, OutlinedInput, InputAdornment, IconButton, InputLabel, Button, FormControl} from '@material-ui/core';

export default function PaginaLogin() {

  const classes = useStyles();

  const [values, setValues] = React.useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return(
    <Grid className={classes.image.src}>
      <Paper elevation={10} className={classes.paper}> 
        <Grid align="center">
          <Avatar className={classes.avatar}>
            <AccountCircle fontSize="large"/>
          </Avatar>
          <h2>Login</h2>
        </Grid>
        <TextField label="E-mail" variant="outlined" fullWidth/>
        <div style={{ height: 20}} />
        <FormControl className={clsx(classes.margin)} variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
            />
        </FormControl>
        <div style={{ height: 40}} />
        <Button className={classes.button_submit} type="submit" color="primary" variant="contained" fullWidth>
          Entrar
        </Button> 
      </Paper>
    </Grid>
  );
}
