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

  static async obterPendentes() {
    const { data } = await Axios.get(`${Config.api}/pendentes`);
    return data;
  }

  static async listarAssociados() {
    try {
      const response = await Axios.get(`${Config.api}/associados`);
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async cadastrarAssociado(associado) {
    const { data } = await Axios.post(`${Config.api}/associados`, associado);
    return data;
  }

  static async atualizarAssociado(associado, id) {
    const { data } = await Axios.put(`${Config.api}/associados/${id}`, associado);
    return data;
  }

  static async buscarPorId(id) {
    const { data } = await Axios.get(`${Config.api}/associados/${id}`);
    return data;
  }

  static async deletarAssociado(id) {
    await Axios.delete(`${Config.api}/associados/${id}`);
  }
}

export default ServicoAssociado;
