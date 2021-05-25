import axios from 'axios';
import config from './config';
const token = localStorage.getItem("associadoToken")
const instance = axios.create(   
    //consultar o localStorage
);
instance.defaults.baseURL = config.apiHost;
instance.defaults.headers = {'x-access-token': token}

//pegando token do localStorage


//instance.defaults.headers = {'x-acess-token': token}

// instance.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         const { response } = error;

//         if (response.status === 498) {
//             // Sessão expirada
//             console.log('asd');
//             window.location = 'expired';
//         }
//     }
// );

export default instance;