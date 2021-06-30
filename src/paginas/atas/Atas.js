import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Atas() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Atas',
      key: 'atas',
      path: '/atas',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Atas;
