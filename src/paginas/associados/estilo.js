import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root:{
    width: '100%',
    height: '100%',
  },
  mockProgressBar: {
    height: '2px',
  },
  table: {
    position: 'relative',
  },
  tableLoading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.5)',
    zIndex: '999'
  },
  button: {
    marginBottom: theme.spacing(3),
  },
  divButton: {
    marginBotton: '20px',
  },
}));

export { useStyles };
