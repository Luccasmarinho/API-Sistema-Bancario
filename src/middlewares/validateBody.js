const { messageJson } = require("../utils/utils");
const { objError } = require("../schemas/schemaUser")


const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body)
        return next()
    } catch (error) {
        const arrayErrors = Object.entries(objError)
        const typeError = error.details[0].type
        const fieldName = error.message.split(" ")[0].replaceAll("\"", "")
        const splitError = error.message.split(" ")
        const characters = `${splitError.find((e) => e == Number(e))} caracteres`

        // arrayErrors.forEach((e) => {
        //     if (e[0] == typeError && (typeError == "string.min" || typeError == "string.max") && fieldName == "cpf") return messageJson(res, 400, `${e[1].replace("$", fieldName)} ${characters}`)

        //     if (e[0] == typeError && (typeError == "string.min" || typeError == "string.max") && fieldName == "senha") return messageJson(res, 400, `${e[1].replace("$", fieldName)} ${characters}`)

        //     if (e[0] == typeError) return messageJson(res, 400, `${e[1].replace("$", fieldName)}`)
        // })


        for (let i = 0; i < arrayErrors.length; i++) {
            if (arrayErrors[i][0] == typeError && (typeError == "string.min" || typeError == "string.max") && fieldName == "cpf") {
                return messageJson(res, 400, `${arrayErrors[i][1].replace("$", fieldName)} ${characters}`)
            }

            if (arrayErrors[i][0] == typeError && (typeError == "string.min" || typeError == "string.max") && fieldName == "senha") {
                return messageJson(res, 400, `${arrayErrors[i][1].replace("$", fieldName)} ${characters}`)
            }

            if (arrayErrors[i][0] == typeError) {
                return messageJson(res, 400, `${arrayErrors[i][1].replace("$", fieldName)}`)
            }
        }

        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

module.exports = {
    validateBody
}