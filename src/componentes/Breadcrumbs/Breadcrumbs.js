import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Breadcrumbs as BreadcrumbsMaterial,
  Box,
  Button,
  Typography,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import { useNavigation } from '../../contextos/Navegacao';

function Breadcrumbs(props) {
  const { location } = useNavigation();
  const history = useHistory();

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      {props.useGoBack && (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          style={{ marginRight: '12px' }}
          startIcon={<ArrowBack />}
          onClick={() => history.go(-1)}
        >
          Voltar
        </Button>
      )}
      <BreadcrumbsMaterial separator="/">
        <Typography color="textPrimary" variant="body2">
          Gerenciar
        </Typography>
        <Typography color="textPrimary" variant="body2" style={{ fontWeight: '500' }}>
          {location.title}
        </Typography>
      </BreadcrumbsMaterial>
    </Box>
  );
}

export default Breadcrumbs;
