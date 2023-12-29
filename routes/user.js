const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const { User, Course } = require('../db/index');
const userMiddleware = require('../middleware/user');
const tokenMiddleware = require('../middleware/tokenAuthenticationAdmin');
const jwtPassword = 'something';
// User Routes
/*
    POST /signup : signs up the user
    GET /courses : Gets all Courses
    
*/

router.post('/signup', async (req, res) => {
	// Implement user signup logic
	const { username, password } = req.body;
	try {
		const newUser = new User({
			username: username,
			password: password,
		});

		await newUser.save();

		res.status(201).json({
			message: 'User created successfully',
		});
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

router.post('/signin', userMiddleware, async (req, res, next) => {
	const { username, password } = req.body;
	const token = signJwt(username, password);
	if (token) {
		res.json({ token: token });
	} else {
		res.status(404).json({
			message: 'Some error',
		});
	}
});

router.get('/courses', userMiddleware, tokenMiddleware, async (req, res) => {
	// Implement listing all courses logic
	try {
		const courses = await Course.find({}, { _id: 0, __v: 0 });
		res.status(200).json({
			data: { courses },
		});
	} catch (error) {
		console.error('Error fetching courses:', error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

router.post('/courses/:courseId', userMiddleware, tokenMiddleware, async (req, res) => {
	try {
		const { courseId } = req.params;
		console.log(courseId);
		const courseExists = await Course.findOne({ courseId });

		if (courseExists) {
			req.user.purchasedCourses.push(courseExists);
			await req.user.save();
			res.status(200).json({
				message: 'Course purchased successfully',
			});
		} else {
			res.status(404).json({
				message: 'Course not found',
			});
		}
	} catch (error) {
		console.error('Error purchasing course:', error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

router.get('/purchasedCourses', userMiddleware, tokenMiddleware, async (req, res) => {
	try {
		const userWithPurchases = await User.findById(req.user._id).populate('purchasedCourses');

		if (!userWithPurchases) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		res.status(200).json({
			data: { purchasedCourses: userWithPurchases.purchasedCourses },
		});
	} catch (error) {
		console.error('Error fetching purchased courses:', error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
});

const signJwt = (username, password) => {
	const token = jwt.sign({ username: username, password: password }, jwtPassword);
	return token;
};
module.exports = router;
