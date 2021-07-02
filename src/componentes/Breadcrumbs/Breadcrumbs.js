import React from 'react';
import { Breadcrumbs as BreadcrumbsMaterial, Link, Typography } from '@material-ui/core';

import { useNavigation } from '../../contextos/Navegacao';

function Breadcrumbs() {
  const { location } = useNavigation();

  return (
    <BreadcrumbsMaterial separator="/">
      <Typography color="textPrimary" variant="body2">
        Gerenciar
      </Typography>
      <Typography color="textPrimary" variant="body2" style={{ fontWeight: '500' }}>
        {location.title}
      </Typography>
    </BreadcrumbsMaterial>
  );
}

export default Breadcrumbs;
