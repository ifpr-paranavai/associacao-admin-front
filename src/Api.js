import axios from 'axios';
import config from './config';

const instance = axios.create({
  baseURL: config.apiHost,
});

axios.interceptors.request.use(config => {
  const newConfig = { ...config };
  const token = localStorage.getItem('associadoToken');
  newConfig.headers.Authorization = `Bearer ${token || ''}`;

  return newConfig;
});

export default instance;
