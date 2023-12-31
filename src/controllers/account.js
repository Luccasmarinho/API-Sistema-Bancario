const knex = require("../database/connection");
const { messageJson, verifySingleField, compareId } = require("../utils/utils");
const { hash } = require("bcrypt")


const controllerAccount = {
    getAllAccounts: async (req, res) => {
        const getAll = await knex("usuarios").orderBy("id", "ASC")
        return messageJson(res, 200, getAll)
    },

    createAccount: async (req, res) => {
        const { body: { cpf, email, senha } } = req

        try {
            const { status, message } = await verifySingleField("usuarios", req.body, [email, cpf])

            if (status) return messageJson(res, 400, message)

            const encryptedPass = await hash(senha, 10)

            delete req.body.senha

            const user = {
                ...req.body,
                senha: encryptedPass,
                saldo: 0
            }

            const [insertUser] = await knex("usuarios").insert(user).returning(["id", "nome", "email", "saldo"])

            return messageJson(res, 200, insertUser)
        } catch (error) {
            const codeError = "42P01"
            const errorName = error.message.split(" ")[3]
            if (codeError) return messageJson(res, 400, `Relação '${errorName}' não existe.`)

            return messageJson(res, 500, "Erro interno do servidor.")
        }
    },

    updateAccount: async (req, res) => {
        const { 

            params: { numeroConta }, 
            user: { id, email: emailUser }, 
            body: { email, nova_senha } 

            } = req
        
        try {
            const { status: statusCompare } = compareId(id, numeroConta)

            if(!statusCompare) return messageJson(res, 400, "Número da conta incorreto.")

            const { status } = await verifySingleField("usuarios", req.body, [email])

            if(status && email !== emailUser) return messageJson(res, 400, "Email já cadastrado na nossa base de dados.")

            const encryptedPass = await hash(nova_senha, 10)

            req.body.senha = encryptedPass
            delete req.body.nova_senha

            const [updateUser] = await knex("usuarios")
            .update(req.body)
            .where({ id: numeroConta })
            .returning(["nome", "data_nascimento", "email", "telefone"])

            return messageJson(res, 200, updateUser)

        } catch (error) {
            return messageJson(res, 500, "Erro interno do servidor.")
        }
    },

    deleteAccount: async (req, res) => {
        const { params: { numeroConta }, user: { saldo, id } } = req

        const { status } = compareId(id, numeroConta)

        if (!status) return messageJson(res, 400, "Número da conta incorreto.")

        if (saldo > 0) return messageJson(res, 400, "A conta só pode ser removida se o saldo for zero.")

        try {
            await knex("usuarios").delete().where({ id: numeroConta })
            return messageJson(res, 204)
        } catch (error) {
            console.log(error);
            return messageJson(res, 500, "Erro interno do servidor.")
        }
    },

    getBalance: async (req, res) => messageJson(res, 200, { saldo: req.user.saldo }),

    getExtract: async (req, res) => {
        const { query: { mes, ano }, user: { id } } = req

        const likeCondition = !mes || mes == null
            ? `%${ano}%`
            : `%${mes.padStart(2, "0")}/${ano}%`

        try {
            const depositos = await knex("usuarios")
                .select("depositar.*")
                .join("depositar", "usuarios.id", "=", "depositar.numero_conta")
                .where("usuarios.id", id)
                .whereLike("depositar.data", likeCondition)

            const saques = await knex("usuarios")
                .select("sacar.*")
                .join("sacar", "usuarios.id", "=", "sacar.numero_conta")
                .where("usuarios.id", id)
                .whereLike("sacar.data", likeCondition)

            const transferenciasEnviadas = await knex("usuarios")
                .select("transferir.*")
                .join("transferir", "usuarios.id", "=", "transferir.numero_conta_origem")
                .where("usuarios.id", id)
                .whereLike("transferir.data", likeCondition)

            const transferenciasRecebidas = await knex("usuarios")
                .select("transferir.*")
                .join("transferir", "usuarios.id", "=", "transferir.numero_conta_destino")
                .where("usuarios.id", id)
                .whereLike("transferir.data", likeCondition)


            const objExtract = {
                depositos,
                saques,
                transferenciasEnviadas,
                transferenciasRecebidas
            }

            return messageJson(res, 200, objExtract)
        } catch (error) {
            console.log(error);
            return messageJson(res, 500, "Erro interno do servidor.")
        }

    },
}
module.exports = controllerAccount


