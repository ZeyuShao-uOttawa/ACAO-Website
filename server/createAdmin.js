const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => console.error('MongoDB connection error:', err));

const createAdmin = async () => {
    try {
        const admin = new User({
            email: 'admin@admin.com',
            password: 'admin',
            firstName: 'Acao',
            lastName: 'Acao',
            studentNum: 100000000,
            role: 'admin',
        });
        await admin.save();
        console.log('Admin account created!');
    } catch (error) {
        console.error('Error creating admin account:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();