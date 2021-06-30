import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Eventos() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Eventos',
      key: 'eventos',
      path: '/eventos',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Eventos;
