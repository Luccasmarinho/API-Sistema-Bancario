const joi = require("joi");

const objError = {
    "string.empty": `O campo '$' não pode estar vazio`,
    "any.required": `O campo '$' é obrigatório`,
    "string.base": `O campo '$' precisa ser um texto`,
    "string.min": `O campo '$' precisa ter no mínimo`,
    "string.max": `O campo '$' precisa ter no máximo`,
    "object.unknown": `O campo '$' é inválido`,
    "string.email": `Digite um '$' válido`,
}

const schemaUser = joi.object({
    nome: joi.string().required(),
    cpf: joi.string().min(11).max(11).required(),
    data_nascimento: joi.string().required(),
    email: joi.string().email().required(),
    telefone: joi.string().required(),
    senha: joi.string().min(8).max(20).required()
});


module.exports = {
    schemaUser,
    objError
}
