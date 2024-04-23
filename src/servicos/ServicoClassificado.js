import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoClassificado {
  static async listarClassificados(limite, pagina) {
    try {
      const response = await Axios.get(`${Config.api}/classificados`, {
        params: { ...{ limite, pagina } },
      });
      return response.data;
    } catch (error) {
      // console.error('Erro ao obter dados da API:', error);
      throw error;
    }
  }

  static async buscarPorTitulo(titulo, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/classificados/titulo/${titulo}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
  }

  static async cadastrarClassificado(classificado) {
    const { data } = await Axios.post(`${Config.api}/classificados`, classificado);
    return data;
  }

  static async cadastrarClassificadoComVariosArquivos(idClassificado, anexo) {
    const formData = new FormData();
    formData.append('anexo', anexo);
    await Axios.post(`${Config.api}/classificados/${idClassificado}/anexo`, formData);
  }

  static async atualizarClassificado(classificado, id) {
    const { data } = await Axios.put(`${Config.api}/classificados/${id}`, classificado);
    return data;
  }

  static async buscarPorId(id) {
    const { data } = await Axios.get(`${Config.api}/classificados/${id}`);
    return data;
  }

  static async deletarClassificado(id) {
    await Axios.delete(`${Config.api}/classificados/${id}`);
  }
}

export default ServicoClassificado;
