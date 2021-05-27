import axios from 'axios';
import config from './config';

const instance = axios.create({
  baseURL: config.apiHost,
});

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('associadoToken');
  config.headers.Authorization = `Bearer ${token || ''}`;
  return config;
});

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
