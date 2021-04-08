import React from 'react';
import {Grid, TextField, Button, Paper} from '@material-ui/core';

export default function PaginaLogin() {
  return (
      <Grid container justify="center" styles={{ minHeight : '100vh'}}>
            <Paper elevation={3}>
                <Grid 
                item 
                xs={12} 
                sm ={6} 
                alignItems="center" 
                justify="center"
                direction="column" 
                style={{padding: 100}}>
                  <div  />
                  <div style={{display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth:300}}> 

                    <Grid container justify="center">
                      <img 
                      src="https://th.bing.com/th/id/R331f336a7b480df03c074f32ecc8d6c2?rik=ajdKHhD8EDu%2fZw&pid=ImgRaw"
                      widht={100}
                      height={100}
                      alt="logo"
                      />              
                    </Grid>
                    <TextField label="Email" margin="normal" variant="outlined"/>
                    <TextField label="Senha" margin="normal" variant="outlined" type="password"/>
                    <div style={{ height: 20}} />
                  <Button color="primary" variant="contained">
                    Entrar
                  </Button>           
                  </div>
                </Grid> 
            </Paper>    
        </Grid>
      
  );
    
}
