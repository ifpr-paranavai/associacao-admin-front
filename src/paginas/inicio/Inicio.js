import React, { useEffect } from 'react';
import { Container } from '@material-ui/core';

import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';
import AssociadosPendentes from '../../componentes/AssociadosPendentes/AssociadosPendentes';

import { useNavigation } from '../../contextos/Navegacao';
import { useStyles } from './estilo';

function Inicio() {
  const { setLocation } = useNavigation();
  const classes = useStyles();

  useEffect(() => {
    setLocation({
      title: 'Página Inicial',
      key: 'inicio',
      path: '/',
    });
  }, []);

  return (
    <Container className={classes.root}>
      <Breadcrumbs />
      <div style={{ paddingTop: '16px' }}>
        <AssociadosPendentes />
      </div>
    </Container>
  );
}

export default Inicio;
