import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';

function Eventos() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Eventos',
      key: 'eventos',
      path: '/eventos',
    });
  }, []);

  return <h1>página de Eventos</h1>;
}

export default Eventos;
