const mongoose = require('mongoose');
const atlasUri = require('../utils/mongoConnection')

mongoose.connect(atlasUri?.default)
  .then(() => {
    console.log("Connected to MongoDB Atlas (contact)");

  })
  .catch((e) => {
    console.error("Error connecting to MongoDB Atlas:", e);
  });


const mySchema = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true,
  },
  Lastname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Interests: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
});

const ACCcollection = mongoose.model('contactMsg', mySchema);

module.exports = ACCcollection;