// Middleware for handling auth
const { Admin } = require('../db/index');

async function adminMiddleware(req, res, next) {
	// Implement admin auth logic
	const { username, password } = req.headers;
	try {
		const admin = await Admin.findOne({ username, password });
		if (admin) {
			req.admin = admin;
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

module.exports = adminMiddleware;
