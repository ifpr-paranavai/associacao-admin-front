import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  mockProgressBar: {
    height: '2px',
  },
  table: {
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.5)',
    zIndex: '999',
  },
  divButton: {
    marginBotton: '20px',
  },
  wrapper: {
    margin: theme.spacing(1),
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
