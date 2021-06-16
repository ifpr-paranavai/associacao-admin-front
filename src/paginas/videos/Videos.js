import React, { useEffect } from 'react';
import { useNavigation } from '../../contextos/Navegacao';

function Videos() {
  const { setLocation } = useNavigation();
  useEffect(() => {
    setLocation({
      title: 'Gestão de Vídeos',
      key: 'videos',
      path: '/videos',
    });
  }, []);

  return <h1>página de Vídeos</h1>;
}

export default Videos;
