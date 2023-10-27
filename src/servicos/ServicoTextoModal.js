import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoTextoModal {
  static async listarTextoModal() {
    try {
      // Usa o operador spread para passar os parâmetros como query string na URL
      const response = await Axios.get(`${Config.api}/textoModal`);
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async atualizarTextoModal(textoModal) {
    const { data } = await Axios.put(`${Config.api}/textoModal/1`, textoModal);
    return data;
  }
}

export default ServicoTextoModal;
