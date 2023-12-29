const mongoose = require('mongoose');

// Connect to MongoDB
const url = 'mongodb+srv://fyzanshaik:1234567890@assignment.arp7u6e.mongodb.net/';

mongoose.connect(url).then(() => {
    console.log('Connected to the Database');
}).catch(err => {
    console.error('Error connecting to the database:', err);
});
// Define schemas
const AdminSchema = new mongoose.Schema({
	// Schema definition here
	username: String,
	password: String,
});

const UserSchema = new mongoose.Schema({
	// Schema definition here
	username: String,
	password: String,
	purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const CourseSchema = new mongoose.Schema({
	// Schema definition here
	courseId: Number,
	title: String,
	description: String,
	price: Number,
	imageLink: String,
});



const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
	Admin,
	User,
	Course,
};
