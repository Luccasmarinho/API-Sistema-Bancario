const joi = require("joi");

const schemas = {
    user: joi.object({
        nome: joi.string().required(),
        cpf: joi.string().min(11).max(11).required(),
        data_nascimento: joi.string().required(),
        email: joi.string().email().required(),
        telefone: joi.string().required(),
        senha: joi.string().min(8).max(20).required()
    }),
    update: joi.object({
        nome: joi.string().required(),
        data_nascimento: joi.string().required(),
        email: joi.string().email().required(),
        telefone: joi.string().required(),
        senha: joi.string().min(8).max(20).required(),
        nova_senha: joi.string().min(8).max(20).required()
    }),
    login: joi.object({
        email: joi.string().email().required(),
        senha: joi.string().min(8).max(20).required()
    }),
    delete: joi.object({
        senha: joi.string().min(8).max(20).required()
    }),
    deposit: joi.object({
        numero_conta: joi.number().positive().integer().required(),
        valor: joi.number().min(1).integer().required()
    }),
    withdraw: joi.object({
        numero_conta: joi.number().positive().integer().required(),
        valor: joi.number().min(1).integer().required(),
        senha: joi.string().min(8).max(20).required()
    }),
    transfer: joi.object({
        numero_conta_origem: joi.number().positive().integer().required(),
        numero_conta_destino: joi.number().positive().integer().required(),
        valor: joi.number().min(1).integer().required(),
        senha: joi.string().min(8).max(20).required()
    }),
    error: {
        "string.empty": `O campo '$' não pode estar vazio`,
        "any.required": `O campo '$' é obrigatório`,
        "string.base": `O campo '$' precisa ser um texto`,
        "string.min": `O campo '$' precisa ter no mínimo`,
        "string.max": `O campo '$' precisa ter no máximo`,
        "object.unknown": `O campo '$' é inválido`,
        "string.email": `Digite um '$' válido`,
        "number.base": "O campo '$' precisa ser um número",
        "number.positive": "O campo '$' precisa ser um número positivo",
        "number.integer": "O campo '$' precisa ser um número inteiro",
        "number.min": "O '$' precisa ser de no mínimo 1",
    }
}

module.exports = schemas
