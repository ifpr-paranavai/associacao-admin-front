import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';

function Atas() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Atas',
      key: 'atas',
      path: '/atas',
    });
  }, []);

  return <h1>página de Atas</h1>;
}

export default Atas;
