import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root:{
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.grey[300],
        paddingTop: theme.spacing(5),

    },

}));

export {useStyles};