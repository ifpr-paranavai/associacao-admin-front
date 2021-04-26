import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#0e54e2',
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    paper: {
        padding: '40px',
        height: '60vh',
        width: '288px',
        margin: '50px auto'
    },
    button_submit: {
        backgroundColor: '#0e54e2',
    },
    
    image: {
        src:"https://static.vecteezy.com/ti/fotos-gratis/p1/1309783-ceu-azul-com-nuvens-gr%C3%A1tis-foto.jpg",
    },
}));

export { useStyles };