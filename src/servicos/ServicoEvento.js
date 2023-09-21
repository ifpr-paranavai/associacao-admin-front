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
}

export default ServicoEvento;
