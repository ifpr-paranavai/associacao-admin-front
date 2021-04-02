import {Grid, TextField, Button} from '@material-ui/core';
import './index.css';
import React from 'react';

export default function PaginaLogin() {

  return (
      <Grid container justify="center" styles={{ minHeight : '100vh'}}>
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
      </Grid>
    /* 
        <Grid  
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{height:"100%"}}
            spacing={3}
        >
          
            <CardContent>
              <form>
                <Grid spacing={5} container alignItems="center">
                    <Grid xs={12} item >
                      <TextField id="email" label="E-mail" variant="outlined"/>
                    </Grid>
                    <Grid xs={12} item>
                      <TextField className="mt-5" id="senha" type= "password" label="Senha" variant="outlined" />
                    </Grid> 
                    <Grid>
                      <Button id="botaoEntrar" variant="contained" color="primary">
                        Entrar
                      </Button>
                    </Grid>
                    
                                        
                </Grid>                               
              </form>
            </CardContent>
          </Grid>
    </Container> */

  );
    
}
