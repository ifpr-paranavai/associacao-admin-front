import React from 'react';
import clsx from 'clsx';
import { Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItemIcon, ListItemText, ListItem } from '@material-ui/core';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useStyles } from './estilo.js';
import { useTheme } from '@material-ui/core/styles';
import { DadosBarraNavegacao } from './DadosBarraNavegacao';
import { Route, Switch }  from 'react-router-dom';
import Inicio from './../../paginas/inicio/Inicio';
import Associados from './../../paginas/associados/Associados';
import Eventos from './../../paginas/eventos/Eventos';
import Atas from './../../paginas/atas/Atas';
import Noticias from './../../paginas/noticias/Noticias';
import Classificados from './../../paginas/classificados/Classificados.js';
import Fotos from '../../paginas/fotos/Fotos.js';
import Videos from '../../paginas/videos/Videos.js';


export default function BarraNavegacao() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selecionado, setSelecionado] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelecionado(index);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleSair = () => {
    console.log("Implementar");
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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <FaIcons.FaBars />
          </IconButton>
          <Typography variant="h6" noWrap>
            Página
          </Typography>
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
            {theme.direction === 'ltr' ? <FaIcons.FaChevronLeft /> : <FaIcons.FaChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {DadosBarraNavegacao.map((item, indice) => (
            <ListItem
              to={item.rota}
              key={item.texto}
              selected={selecionado === indice}
              onClick={(event) => handleListItemClick(event, indice)}
              component={Link}
              className={ classes.link }
            >
              <ListItemIcon>{ item.icone} </ListItemIcon>
              <ListItemText primary={ item.texto } />
            </ListItem>
          ))}
          <Divider />
          <ListItem
            onClick={(event) => handleSair(event)}
            className={ classes.link }
          >
            <ListItemIcon><FaIcons.FaSignOutAlt size={ 25 }/></ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route exact path="/" component={ Inicio }/>
          <Route path="/eventos" component={Eventos} />
          <Route path="/associados" component={ Associados }/>
          <Route path="/atas" component={Atas}/>
          <Route path="/noticias" component={Noticias}/>
          <Route path="/classificados" component={Classificados}/>
          <Route path="/fotos" component={Fotos} />
          <Route path="/videos" component={Videos}/>
        </Switch>
      </main>
    </div>
  );
}
