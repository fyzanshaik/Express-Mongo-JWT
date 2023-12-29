const { Router } = require('express');
const jwt = require('jsonwebtoken');
const adminMiddleware = require('../middleware/admin');
const tokenMiddleware = require('../middleware/tokenAuthenticationAdmin');
const { Admin, User, Course } = require('../db/index');
const router = Router();
const jwtPassword = 'something';
let id = 0;
// Admin Routes
router.post('/signup', async (req, res) => {
	// Implement admin signup logic
	const { username, password } = req.body;
	try {
		const newAdmin = new Admin({
			username: username,
			password: password,
		});

		await newAdmin.save();

		res.status(200).json({
			message: 'Admin created successfully',
		});
	} catch (error) {
		console.error('Error creating admin:', error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

const signJwt =  (username, password) => {
	const token =  jwt.sign({ username: username, password: password }, jwtPassword);
	return token;
};

router.post('/signin', adminMiddleware, async (req, res) => {
	// Implement admin signup logic
	const { username, password } = req.body;
	const token = signJwt(username, password);
	if (token) {
		res.json({ token: token });
	}else {
		res.status(404).json({
			message : "Some error"
		})
	}
});

router.post('/courses', adminMiddleware, tokenMiddleware, async (req, res) => {
	// Implement course creation logic
	const { title, description, price, imageLink } = req.body;

	try {
		const newCourse = new Course({
			courseId: ++id,
			title: title,
			description: description,
			price: price,
			imageLink: imageLink,
		});

		await newCourse.save();

		res.status(200).json({
			message: 'Course created successfully',
			courseId: newCourse.courseId,
		});
	} catch (error) {
		console.error('Error creating course:', error);
		res.status(500).json({
			message: 'Internal server error',
		});
	}
});

router.get('/courses', adminMiddleware, tokenMiddleware, async (req, res) => {
	// Implement fetching all courses logic
	try {
		const courses = await Course.find({}, { __id: 0, __v: 0 });
		res.status(200).json({
			courses,
		});
	} catch (err) {
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

module.exports = router;
