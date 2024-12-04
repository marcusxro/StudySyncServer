import mongoose from 'mongoose';



mongoose.connect('mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/StudySync')
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

export default ACCcollection;