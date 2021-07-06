import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoAssociado {
  static async obterAssociados({ start, perPage, filter }) {
    const { data } = await Axios.get(`${Config.api}/associados`, {
      params: {
        start,
        perPage,
        filter,
      },
    });
    return data;
  }

  static async cadastrarAssociado(associado) {
    const { data } = await Axios.post(`${Config.api}/associados`, associado);
    return data;
  }

  static async atualizarAssociado(associado) {
    const { data } = await Axios.put(`${Config.api}/associados`, associado);
    return data;
  }

  static async buscarPorId(_id) {
    const { data } = await Axios.get(`${Config.api}/associados/${_id}`);
    return data;
  }

  static async deletarAssociado(_id) {
    await Axios.delete(`${Config.api}/associados/${_id}`);
  }
}

export default ServicoAssociado;
