import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoEvento {
  static async listarEventos(limite, pagina) {
    try {
      const response = await Axios.get(`${Config.api}/eventos`, {
        params: { ...{ limite, pagina } },
      });
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async buscarPorTitulo(titulo, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/eventos/titulo/${titulo}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
  }

  static async buscarPorData(date, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/eventos/data/${date}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
  }

  static async cadastrarEvento(evento) {
    const { data } = await Axios.post(`${Config.api}/eventos`, evento);
    return data;
  }

  static async atualizarEvento(evento, id) {
    const { data } = await Axios.put(`${Config.api}/eventos/${id}`, evento);
    return data;
  }

  static async buscarPorId(id) {
    const { data } = await Axios.get(`${Config.api}/eventos/${id}`);
    return data;
  }

  static async deletarEvento(id) {
    await Axios.delete(`${Config.api}/eventos/${id}`);
  }

  static async uploadAnexo(idEvento, anexo) {
    const formData = new FormData();
    formData.append('anexo', anexo);
    await Axios.post(`${Config.api}/eventos/${idEvento}/anexo`, formData);
  }

  static async preview(id) {
    try {
      const response = await Axios.get(`${Config.api}/eventos/${id}/anexo/download`, {
        responseType: 'blob',
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      throw new Error(`Falha ao exibir visualização: ${error}`);
    }
  }
}

export default ServicoEvento;
