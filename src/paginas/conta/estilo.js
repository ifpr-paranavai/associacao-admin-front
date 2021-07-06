import { makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: '0px',
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '100%',
  },
  fieldMargin: {
    marginTop: '2px',
  },
  title: {
    fontWeight: '500',
  },
  wrapper: {
    position: 'relative',
  },
  pageLoading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.5)',
    zIndex: '999',
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
