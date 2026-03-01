require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = new User({
                name: 'System Admin',
                email: 'admin@dwms.com',
                password: 'adminpassword123',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin created: [Email: admin@dwms.com, Password: adminpassword123]');
        } else {
            console.log('Admin already exists: ' + admin.email);
            // Let's ensure the password is one we know by resetting it
            admin.password = 'adminpassword123';
            await admin.save();
            console.log('Admin password guaranteed to be: adminpassword123');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
