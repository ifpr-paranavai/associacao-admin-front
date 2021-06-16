import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';

function Classificados() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Classificados',
      key: 'classificados',
      path: '/classificados',
    });
  }, []);

  return <h1>página de Classificados</h1>;
}

export default Classificados;
