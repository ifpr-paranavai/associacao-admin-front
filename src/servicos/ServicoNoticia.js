import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoNoticia {
  static async listarNoticias(limite, pagina) {
    try {
      const response = await Axios.get(`${Config.api}/noticias`, {
        params: { ...{ limite, pagina } },
      });
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async buscarPorTitulo(titulo, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/noticias/titulo/${titulo}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
  }

  static async buscarPorData(date, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/noticias/data/${date}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
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

  static async uploadAnexo(idNoticia, anexo) {
    const formData = new FormData();
    formData.append('anexo', anexo);
    await Axios.post(`${Config.api}/noticias/${idNoticia}/anexo`, formData);
  }

  static async preview(id) {
    try {
      const response = await Axios.get(`${Config.api}/noticias/${id}/anexo/download`, {
        responseType: 'blob',
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      throw Error(`Erro ao exibir visualização: ${error}`);
    }
  }
}

export default ServicoNoticia;
