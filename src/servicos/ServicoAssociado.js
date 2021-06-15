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
      return error;
    }
  }

  static async cadastrarAssociado(associado) {
    try {
      const { data } = await Axios.post(`${Config.api}/associados`, associado);
      return data;
    } catch (error) {
      return error;
    }
  }

  static async atualizarAssociado(associado) {
    try {
      const { data } = await Axios.put(`${Config.api}/associados`, associado);
      return data;
    } catch (error) {
      return error;
    }
  }
  
  static async deletarAssociado(_id) {
    try {
      await Axios.delete(`${Config.api}/associados/${_id}`);
    } catch (error) {
      return error;
    }
  }
}

export default ServicoAssociado;
