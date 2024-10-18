import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoClassificado {
  static async listarClassificados(limite, pagina) {
    try {
      const response = await Axios.get(`${Config.api}/classificados-admin`, {
        params: { limite, pagina },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorTitulo(titulo, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/classificados/titulo/${titulo}`, {
      params: { limite, pagina },
    });
    return data;
  }

  static async cadastrarClassificado(classificado) {
    const { data } = await Axios.post(`${Config.api}/classificados`, classificado);
    return data;
  }

  static async cadastrarClassificadoComVariosArquivos(idClassificado, formData) {
    const { data } = await Axios.post(
      `${Config.api}/classificados/${idClassificado}/anexo`,
      formData,
    );
    return data;
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

  static async uploadAnexo(idClassificado, anexo) {
    const formData = new FormData();
    formData.append('anexo', anexo);
    await Axios.post(`${Config.api}/classificados/${idClassificado}/anexo`, formData);
  }

  static async downloadAnexo(id) {
    try {
      const response = await Axios.get(
        `${Config.api}/classificados/${id}/anexo/download`,
        {
          responseType: 'blob',
        },
      );
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      throw new Error(`Falha ao fazer download do anexo: ${error}`);
    }
  }

  static async previewAnexo(id) {
    try {
      const response = await Axios.get(
        `${Config.api}/classificados/${id}/anexo/visualizar`,
      );
      return response.data.imagens;
    } catch (error) {
      throw new Error(`Falha ao visualizar o anexo: ${error}`);
    }
  }
}

export default ServicoClassificado;
