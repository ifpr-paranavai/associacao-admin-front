import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoNoticia {
  static async listarNoticias() {
    try {
      const response = await Axios.get(`${Config.api}/noticias`);
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async cadastrarNoticia(noticia) {
    const { data } = await Axios.post(`${Config.api}/noticias`, noticia);
    return data;
  }

  static async atualizarNoticia(noticia, id) {
    const { data } = await Axios.put(`${Config.api}/noticias/${id}`, noticia);
    return data;
  }

  static async buscarPorId(id) {
    const { data } = await Axios.get(`${Config.api}/noticias/${id}`);
    return data;
  }

  static async deletarNoticia(id) {
    await Axios.delete(`${Config.api}/noticias/${id}`);
  }
}

export default ServicoNoticia;
