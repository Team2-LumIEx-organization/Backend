const mongoose = require('mongoose');
const cron = require('node-cron');
const User = require('../model/User');
const Parcel = require('../model/parcels');

mongoose.connect('mongodb://127.0.0.1:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });

const getRandomUser = async (excludeUserId) => {
    const query = {
        is_deleted: false,
        type: { $ne: 'DRIVER' },
        _id: { $ne: excludeUserId }, // Exclude the current user
    };

    const count = await User.countDocuments(query);
    const randomIndex = Math.floor(Math.random() * count);
    const randomUser = await User.findOne(query).skip(randomIndex);
    return randomUser;
};
const generateTwoRandomLocations = () => {
    let x = 1
    let y = 1
    while(x === y){
        x = Math.floor(Math.random() * 5) + 1
        y = Math.floor(Math.random() * 5) + 1
    }
    return [x, y]
}
const createRandomParcels = async (user) => {
    const parcelCount = Math.floor(Math.random() * 3);
    const locations = generateTwoRandomLocations()
    console.log(locations)
    for (let i = 0; i < parcelCount; i++) {
        const receiver = await getRandomUser(user._id);
        const newParcel = new Parcel({
            sender: user._id,
            reciver: receiver._id,
            delivery_status: 'DELIVERED',
            sender_location: locations[0],
            sender_cabinent: Math.floor(Math.random() * 15) + 1,
            reciver_location: locations[1],
            reciver_cabinent: Math.floor(Math.random() * 15) + 1,
            size: '1,1,1',
            mass: '15',
            name: 'the best robot ever',
            address: 'robot-address',
            phone_number: 'robot-phone'
        });

        await newParcel.save();
    }
};

// cron.schedule('*/5 * * * * *', async () => {
cron.schedule('*/5 * * * * *', async () => {

    try {
        const users = await User.find({ is_deleted: false, type: { $ne: 'DRIVER' } });
        // const users = await User.find({});

        for (const user of users) {
            await createRandomParcels(user);
        }

        console.log('users');
    } catch (error) {
        console.error('Error creating random parcels:', error);
    }
});

