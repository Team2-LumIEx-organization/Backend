const mongoose = require('mongoose');

const Location = require('../model/Location');

mongoose.connect('mongodb://127.0.0.1:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });

async function createLocations() {
  try {
    const cabinentsArray= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item) => {
      return { occupied: false, id: item, key: '', user: '', parcel: '' }
    })

    const location1 = new Location({
      location_id: 1,
      cabinents: cabinentsArray
    });
    const location2 = new Location({
      location_id: 2,
      cabinents: cabinentsArray
    });
    const location3 = new Location({
      location_id: 3,
      cabinents: cabinentsArray
    });
    const location4 = new Location({
      location_id: 4,
      cabinents: cabinentsArray
    });
    const location5 = new Location({
      location_id: 5,
      cabinents: cabinentsArray
    });
    
    await location1.save();
    await location2.save();
    await location3.save();
    await location4.save();
    await location5.save();
    console.log('locations created!');
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
}

createLocations();
