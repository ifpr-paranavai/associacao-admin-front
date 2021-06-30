import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Fotos() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Fotos',
      key: 'fotos',
      path: '/fotos',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Fotos;
