import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';

function Inicio() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Página Inicial',
      key: 'inicio',
      path: '/',
    });
  }, []);

  return <h1>página Inicial</h1>;
}

export default Inicio;
