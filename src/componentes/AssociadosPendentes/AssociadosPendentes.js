import React from 'react';

import { Box, CardContent, Card, Typography, Avatar, Button } from '@material-ui/core';
import { Check, Person } from '@material-ui/icons';

const AssociadosPendentes = () => (
  <Card>
    <CardContent>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        paddingBottom="8px"
        borderBottom="1px solid #1976d2"
      >
        <Typography variant="h6" color="primary">
          Associados pendentes
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="14px"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            alt="Teste"
            src={undefined}
            style={{ marginRight: '10px', width: '32px', height: '32px' }}
          />
          <span style={{ marginRight: '3px' }}>Teste</span>
          {/* {associado.sobrenome && <span>{associado.sobrenome}</span>} */}
        </Box>
        <Button
          variant="outlined"
          size="small"
          style={{ borderColor: '#009933', color: '#009933' }}
        >
          <Check fontSize="small" htmlColor="#009933" />
          Aceitar
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="14px"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            alt="Teste"
            src={undefined}
            style={{ marginRight: '10px', width: '32px', height: '32px' }}
          />
          <span style={{ marginRight: '3px' }}>Teste</span>
          {/* {associado.sobrenome && <span>{associado.sobrenome}</span>} */}
        </Box>
        <Button
          variant="outlined"
          size="small"
          style={{ borderColor: '#009933', color: '#009933' }}
        >
          <Check fontSize="small" htmlColor="#009933" />
          Aceitar
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="14px"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            alt="Teste"
            src={undefined}
            style={{ marginRight: '10px', width: '32px', height: '32px' }}
          />
          <span style={{ marginRight: '3px' }}>Teste</span>
          {/* {associado.sobrenome && <span>{associado.sobrenome}</span>} */}
        </Box>
        <Button
          variant="outlined"
          size="small"
          style={{ borderColor: '#009933', color: '#009933' }}
        >
          <Check fontSize="small" htmlColor="#009933" />
          Aceitar
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="14px"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <Avatar
            alt="Teste"
            src={undefined}
            style={{ marginRight: '10px', width: '32px', height: '32px' }}
          />
          <span style={{ marginRight: '3px' }}>Teste</span>
          {/* {associado.sobrenome && <span>{associado.sobrenome}</span>} */}
        </Box>
        <Button
          variant="outlined"
          size="small"
          style={{ borderColor: '#009933', color: '#009933' }}
        >
          <Check fontSize="small" htmlColor="#009933" />
          Aceitar
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default AssociadosPendentes;
