import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoAta {
  static async listarAtas() {
    try {
      const response = await Axios.get(`${Config.api}/atas`);
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async cadastrarAta(ata) {
    const { data } = await Axios.post(`${Config.api}/atas`, ata);
    return data;
  }

  static async atualizarAta(ata, id) {
    const { data } = await Axios.put(`${Config.api}/atas/${id}`, ata);
    return data;
  }

  static async buscarPorId(id) {
    const { data } = await Axios.get(`${Config.api}/atas/${id}`);
    return data;
  }

  static async deletarAta(id) {
    await Axios.delete(`${Config.api}/atas/${id}`);
  }
}

export default ServicoAta;
