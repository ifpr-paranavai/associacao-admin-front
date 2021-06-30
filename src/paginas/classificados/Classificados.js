import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Classificados() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Classificados',
      key: 'classificados',
      path: '/classificados',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Classificados;
