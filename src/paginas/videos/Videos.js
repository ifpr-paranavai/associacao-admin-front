import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Videos() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Vídeos',
      key: 'videos',
      path: '/videos',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Videos;
