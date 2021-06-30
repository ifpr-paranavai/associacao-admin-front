import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Inicio() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Página Inicial',
      key: 'inicio',
      path: '/',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Inicio;
