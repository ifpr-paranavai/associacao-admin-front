import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';

function Fotos() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Fotos',
      key: 'fotos',
      path: '/fotos',
    });
  }, []);

  return <h1>página de Fotos</h1>;
}

export default Fotos;
