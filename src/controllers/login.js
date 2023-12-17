const knex = require("../database/connection");
const { messageJson, verifySingleField } = require("../utils/utils");
const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
    const { body: { email, senha } } = req

    try {
        const { status, query } = await verifySingleField("usuarios", req.body, [email])

        if (!status) return messageJson(res, 404, "Não foi possível encontrar uma conta com o email fornecido. Verifique seu email e tente novamente.")

        const validPassword = await compare(senha, query[0].senha)

        if (!validPassword) return messageJson(res, 400, "Dados incorretos. Verifique seus dados e tente novamente.")

        const payload = { id: query[0].id}
        const options = { expiresIn: "24h" }

        const token = jwt.sign(payload, process.env.SECRET_KEY, options)
        
        delete query[0].senha
        delete query[0].cpf
        delete query[0].data_nascimento
        delete query[0].telefone

        const loginUser = {
            usuario: query[0],
            token
        }

        return messageJson(res, 200, loginUser)
    } catch (error) {
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

module.exports = login