import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Site() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Modificar o Site',
      key: 'site',
      path: '/site',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Site;
