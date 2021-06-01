import { colors, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  imageSize: {
    width: '82px',
    height: '82px',
    borderRadius: '4px',
  },
  removeButton: {
    position: 'absolute',
    top: '-9px',
    right: '-9px',
    width: '22px',
    height: '22px',
    color: 'white',
    cursor: 'pointer',
    background: colors.red[600],
    borderRadius: '100%',

    '&:hover': {
      background: colors.red[800],
    },
  },
}));

export { useStyles };
