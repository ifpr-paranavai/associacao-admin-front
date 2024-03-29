import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoFoto {
  static async listarFotos(limite, pagina) {
    try {
      const response = await Axios.get(`${Config.api}/fotos`, {
        params: { ...{ limite, pagina } },
      });
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async buscarPorTitulo(titulo, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/fotos/titulo/${titulo}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
  }

  static async cadastrarFoto(foto) {
    const { data } = await Axios.post(`${Config.api}/fotos`, foto);
    return data;
  }

  static async atualizarFoto(foto, id) {
    const { data } = await Axios.put(`${Config.api}/fotos/${id}`, foto);
    return data;
  }

  static async buscarPorId(id) {
    const { data } = await Axios.get(`${Config.api}/fotos/${id}`);
    return data;
  }

  static async deletarFoto(id) {
    await Axios.delete(`${Config.api}/fotos/${id}`);
  }
}

export default ServicoFoto;
