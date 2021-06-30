import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';
import Breadcrumbs from '../../componentes/Breadcrumbs/Breadcrumbs';

function Noticias() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Notícias',
      key: 'noticias',
      path: '/noticias',
    });
  }, []);

  return <Breadcrumbs />;
}

export default Noticias;
