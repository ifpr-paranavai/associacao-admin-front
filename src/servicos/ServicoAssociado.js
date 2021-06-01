import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoAssociado {
  static async obterAssociados({ _start, _end }) {
    try {
      const { data } = await Axios.get(`${Config.api}/associados`, {
        _start,
        _end,
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async cadastrarAssociado(associado) {
    try {
      const { data } = await Axios.post(`${Config.api}/associados`, associado);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default ServicoAssociado;
