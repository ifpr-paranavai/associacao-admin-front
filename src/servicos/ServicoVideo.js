import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoVideo {
  static async listarVideos(limite, pagina) {
    try {
      const response = await Axios.get(`${Config.api}/videos`, {
        params: { ...{ limite, pagina } },
      });
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async buscarPorTitulo(titulo, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/videos/titulo/${titulo}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
  }

  static async cadastrarVideo(video) {
    const { data } = await Axios.post(`${Config.api}/videos`, video);
    return data;
  }

  static async atualizarVideo(video, id) {
    const { data } = await Axios.put(`${Config.api}/videos/${id}`, video);
    return data;
  }

  static async buscarPorId(id) {
    const { data } = await Axios.get(`${Config.api}/videos/${id}`);
    return data;
  }

  static async deletarVideo(id) {
    await Axios.delete(`${Config.api}/videos/${id}`);
  }
}

export default ServicoVideo;
