const knex = require("../database/connection");
const { compare } = require("bcrypt");
const { messageJson } = require("../utils/utils");


const validatePassword = async (req, res, next) => {
    const { body: { senha, email } } = req

    try {
        if (req.path.includes("/login")) {
            const [row] = await knex("usuarios").where({ email })
            if (!row) return messageJson(res, 404, "Não foi possível encontrar uma conta com o email fornecido. Verifique seu email e tente novamente.")
            
            const truePassword = await compare(senha, row.senha)
            if (!truePassword) return messageJson(res, 400, "Senha incorreta. Verifique sua senha e tente novamente.")

            return next()
        }

        if (req.path.includes("/transacoes")) {
            const { user: { id } } = req

            const [row] = await knex("usuarios").where({ id })

            const truePassword = await compare(senha, row.senha)
            if (!truePassword) return messageJson(res, 400, "Senha incorreta. Verifique sua senha e tente novamente.")

            return next()
        }
    } catch (error) {
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

module.exports = validatePassword