import React from 'react';
import { Route, Switch, Link, useHistory } from 'react-router-dom';
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  colors,
} from '@material-ui/core';
import * as FaIcons from 'react-icons/fa';
import { useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useStyles } from './estilo';
import DadosBarraNavegacao from './DadosBarraNavegacao';

import Inicio from '../../paginas/inicio/Inicio';
import Associados from '../../paginas/associados/Associados';
import Eventos from '../../paginas/eventos/Eventos';
import Atas from '../../paginas/atas/Atas';
import Noticias from '../../paginas/noticias/Noticias';
import Classificados from '../../paginas/classificados/Classificados';
import Fotos from '../../paginas/fotos/Fotos';
import Videos from '../../paginas/videos/Videos';
import Site from '../../paginas/site/Site';
import MinhaConta from '../../paginas/conta/Conta';
import PaginaLogin from '../PaginaLogin/PaginaLogin';
import { baseRoute } from '../../uteis/rota.json';

import ServicoAutenticacao from '../../servicos/ServicoAutenticacao';
import { useNavigation } from '../../contextos/Navegacao';
import LogoWhite from '../../assets/logo-amaer.png';

export default function BarraNavegacao(props) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { location } = useNavigation();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const Autenticacao = new ServicoAutenticacao();
  const associadoLogado = Autenticacao.obterAssociadoLogado();

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAccount = () => {
    history.push('/minha-conta');
    handleClose();
  };

  const handleSair = () => {
    Autenticacao.removerAssociadoLocalStorage();
    props.onLogout();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ width: '100%' }}
          >
            <Box display="flex" alignItems="center">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <FaIcons.FaBars />
              </IconButton>
              <img
                src={LogoWhite}
                alt="Logo Amaer"
                width="160px"
                style={{ marginRight: '16px' }}
              />
            </Box>
            {associadoLogado?.id && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  style={{ padding: '2px' }}
                >
                  <Avatar
                    alt={associadoLogado.nome}
                    src={associadoLogado.imagem?.src}
                    style={{ width: '36px', height: '36px' }}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  keepMounted
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  open={openMenu}
                  onClose={handleClose}
                >
                  <MenuItem unselectable>
                    <Box display="flex" flexDirection="column">
                      <span style={{ fontSize: '13px', color: colors.grey[700] }}>
                        Usuário logado
                      </span>
                      <span>
                        {`${associadoLogado.nome} ${
                          associadoLogado.sobrenome ? ` ${associadoLogado.sobrenome}` : ''
                        }`}
                      </span>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleAccount}>Minha conta</MenuItem>
                  <MenuItem onClick={handleSair}>Sair</MenuItem>
                </Menu>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <FaIcons.FaChevronLeft />
            ) : (
              <FaIcons.FaChevronRight />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {DadosBarraNavegacao.map(item => (
            <ListItem
              to={item.rota}
              key={item.texto}
              selected={item.key === location.key}
              component={Link}
              className={classes.link}
            >
              <ListItemIcon>{item.icone} </ListItemIcon>
              <ListItemText primary={item.texto} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route exact path={`${baseRoute}/inicio`} component={Inicio} />
          <Route exact path={`${baseRoute}/login`} component={PaginaLogin} />
          <Route path={`${baseRoute}/eventos`} component={Eventos} />
          <Route path={`${baseRoute}/associados`} component={Associados} />
          <Route path={`${baseRoute}/atas`} component={Atas} />
          <Route path={`${baseRoute}/noticias`} component={Noticias} />
          <Route path={`${baseRoute}/classificados`} component={Classificados} />
          <Route path={`${baseRoute}/fotos`} component={Fotos} />
          <Route path={`${baseRoute}/videos`} component={Videos} />
          <Route path={`${baseRoute}/site`} component={Site} />
          <Route path={`${baseRoute}/minha-conta`} component={MinhaConta} />
        </Switch>
      </main>
    </div>
  );
}
