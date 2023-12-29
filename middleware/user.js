const { User } = require('../db/index');


async function userMiddleware(req, res, next) {
	// Implement user auth logic
	// You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
	const { username, password } = req.headers;
	try {
		const user = await User.findOne({ username, password });
		if (user) {
			req.user = user;
			next();
		} else {
			res.status(401).json({
				message: 'Unauthorized',
			});
		}
	} catch (err) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

module.exports = userMiddleware;
