import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    height: '100vh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: 'url(https://static.vecteezy.com/ti/fotos-gratis/p1/1309783-ceu-azul-com-nuvens-gr%C3%A1tis-foto.jpg)',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: blue[500],
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '40px',
    height: '60vh',
    width: '100%',
    maxWidth: '380px'
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export { useStyles };
