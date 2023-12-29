const { Admin } = require('../db/index');
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
	const token = req.header('Authorization');

	if (!token) return res.sendStatus(401);

	jwt.verify(token, 'something', (err, user) => {
		if (err)
			return res.status(401).json({
				message: 'Invalid Admin',
			});

		next();
	});
};

module.exports = authenticateToken;
