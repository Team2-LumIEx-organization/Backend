const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../model/User');

mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });

async function createAdminUser() {
  try {
    const user = await User.findOne({ role: 'admin' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const adminUser = new User({
      name: 'adminadmin',
      email: 'admin@server.com',
      password: hashedPassword,
      role: 'admin',
      active: true,
    });

    if (!user) {
      const savedAdmin = await adminUser.save();
      console.log('Admin created!');
    } else {
      console.log('Admin already exists!');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
