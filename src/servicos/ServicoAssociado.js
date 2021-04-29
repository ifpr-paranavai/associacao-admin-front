import Axios from "axios";
import Config from "../uteis/configuracao";

class ServicoAssociado {
  static async obterAssociados() {
    try {
      const { data } = await Axios.get(`${Config.api}/associados`);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default ServicoAssociado;
