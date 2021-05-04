import ServicoAutenticacao from "../../servicos/ServicoAutenticacao";
import React from "react";
import clsx from "clsx";
import { useStyles } from "./estilo.js";
import { AccountCircle, Visibility, VisibilityOff } from "@material-ui/icons";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  Button,
  FormControl,
  Link,
} from "@material-ui/core";

export default function PaginaLogin() {
  const classes = useStyles();

  const logar = async (event) => {
    event.preventDefault();
    try {
      await ServicoAutenticacao.logar(values);
      //salvar usuário no local storage;
      //criar variável compartilhada entre o app e a página de login, com redux;
      //usa-la na tela de login para realizar a redirecionação;
      // se autenticação deu certo
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const [values, setValues] = React.useState({
    email: "",
    senha: "",
    mostrarSenha: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, mostrarSenha: !values.mostrarSenha });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Grid className={classes.image.src}>
      <Paper elevation={10} className={classes.paper}>
        <form noValidate onSubmit={logar}>
          <Grid align="center">
            <Avatar className={classes.avatar}>
              <AccountCircle fontSize="large" />
            </Avatar>
            <h2>Login</h2>
          </Grid>
          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            value={values.email}
            onChange={handleChange("email")}
          />
          <div style={{ height: 20 }} />
          <FormControl
            className={clsx(classes.margin)}
            variant="outlined"
            fullWidth
          >
            <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.mostrarSenha ? "text" : "password"}
              value={values.senha}
              onChange={handleChange("senha")}
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
          <Link to="/">
            <Button
              className={classes.button_submit}
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
            >
              Entrar
            </Button>
          </Link>
        </form>
      </Paper>
    </Grid>
  );
}
