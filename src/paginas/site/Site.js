import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';

function Site() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Modificar o Site',
      key: 'site',
      path: '/site',
    });
  }, []);

  return <h1>Modificar o site</h1>;
}

export default Site;
