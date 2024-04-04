import Axios from 'axios';
import Config from '../uteis/configuracao';

class ServicoAta {
  static async listarAtas(limite, pagina) {
    try {
      // Usa o operador spread para passar os parâmetros como query string na URL
      const response = await Axios.get(`${Config.api}/atas`, {
        params: { ...{ limite, pagina } },
      });
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

  static async buscarPorTitulo(titulo, limite, pagina) {
    const { data } = await Axios.get(`${Config.api}/atas/titulo/${titulo}`, {
      params: { ...{ limite, pagina } },
    });
    return data;
  }

  static async deletarAta(id) {
    await Axios.delete(`${Config.api}/atas/${id}`);
  }

  static async uploadAnexo(idAta, anexo) {
    const formData = new FormData();
    formData.append('anexo', anexo);
    await Axios.post(`${Config.api}/atas/${idAta}/anexo`, formData);
  }

  static async downloadAnexo(id) {
    try {
      const response = await Axios.get(`${Config.api}/atas/${id}/anexo/download`, {
        responseType: 'blob',
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      throw new Error(`Falha ao fazer download do anexo: ${error.message}`);
    }
  }

  static async previewAnexo(id) {
    try {
      const response = await Axios.get(`${Config.api}/atas/${id}/anexo/download`, {
        responseType: 'blob',
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      throw new Error(`Falha ao exibir a visualização do anexo: ${error.message}`);
    }
  }
}

export default ServicoAta;
