import React from 'react';
import {
  Breadcrumbs as BreadcrumbsMaterial,
  Link,
  Typography,
} from '@material-ui/core';

import { useNavigation } from '../../contextos/Navegacao';

function Breadcrumbs() {
  const { location } = useNavigation();

  return (
    <BreadcrumbsMaterial separator="/" aria-label="breadcrumb">
      <Link color="inherit">
        Gerenciar
      </Link>
      <Typography color="textPrimary">{location.title}</Typography>
    </BreadcrumbsMaterial>
  );
}

export default Breadcrumbs;
