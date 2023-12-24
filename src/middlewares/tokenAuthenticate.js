const { messageJson, verifySingleField } = require("../utils/utils");
const jwt = require("jsonwebtoken");

const tokenAuthentication = async (req, res, next) => {
    const { headers: { authorization } } = req

    if (!authorization) return messageJson(res, 401, "Não autorizado")

    const token = authorization.split(" ")[1]

    try {
        const verify = jwt.verify(token, process.env.SECRET_KEY)

        const { query } = await verifySingleField("usuarios", verify, [verify.id])

        delete query[0].senha

        req.user = query[0]

        return next()
    } catch (error) {
        if (error.message == "invalid signature") return messageJson(res, 401, "Usuário não autorizado.");

        return messageJson(res, 401, "Não autorizado.");
    }
}

module.exports = tokenAuthentication