import API from '../Api';

const md5 = require('md5');

export default class ServicoAutenticacao {
    //--------------------------AUTH--------------------------//
    static async logar({ email, senha }) {
        try {
            console.log(email+senha)
            let response = await API.post('login', {
                email: email.toLowerCase(),
                senha: md5(senha)
            });
            console.log(response)
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } // login()
}