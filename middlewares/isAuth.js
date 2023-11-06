const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const AUTH_HEADER = "Authorization";
const UNAUTHORIZED_ERROR_MESSAGE = "Usuario no autenticado";
const EXPIRED_TOKEN_ERROR_MESSAGE = "El Token es Invalido";

function middlewareAuth(req, res, next) {
	const authHeader = req.get(AUTH_HEADER);

	if (!authHeader) {
		const error = new Error(UNAUTHORIZED_ERROR_MESSAGE);
		error.statusCode = 401;
		return res.status(401).send({ error: UNAUTHORIZED_ERROR_MESSAGE });
	}

	let decodedToken;
	const token = authHeader.split(" ")[1];
	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decodedToken;
	} catch (err) {
		// manejar errores especificos de JWT y devolver un error 401
		if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
			const error = new Error(EXPIRED_TOKEN_ERROR_MESSAGE);
			error.statusCode = 401;

			return res.status(401).send({
				"errors": [
					{
						"type": "Autentication",
						"value": err,
						"msg": EXPIRED_TOKEN_ERROR_MESSAGE,
						"path": "Token Autentication",
						"location": "isAuth.js"
					},]
			});
		}

		// manejar otros errores y devolver un error 500
		err.statusCode = 500;
		throw err;
	}

	if (!decodedToken) {
		const error = new Error(UNAUTHORIZED_ERROR_MESSAGE);
		error.statusCode = 401;
		return res.status(401).send({
			"errors": [
				{
					"type": "Autentication",
					"value": "",
					"msg": UNAUTHORIZED_ERROR_MESSAGE,
					"path": "Token Autentication",
					"location": "isAuth.js"
				},]
		});
	}

	req.userId = decodedToken.userId;
	next();
}

module.exports = { middlewareAuth };