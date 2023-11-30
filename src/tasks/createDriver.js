const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../model/User');

mongoose.connect('mongodb://127.0.0.1:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });

async function createDriver() {
  try {
    const user = await User.findOne({ type: 'DRIVER' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const driver = new User({
      email: 'driver@gmail.com',
      password: hashedPassword,
      type: 'DRIVER'
    });

    if (!user) {
      await driver.save();
      console.log('Driver created!');
    } else {
      console.log('Driver already exists!');
    }
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

createDriver();
