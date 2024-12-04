import mongoose from 'mongoose';


mongoose.connect(process.env.ATLAS_URI || 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/StudySync')
  .then(() => {
    console.log("Connected to MongoDB Atlas (acc)");

  })
  .catch((e) => {
    console.error("Error connecting to MongoDB Atlas:", e);
  });


const mySchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true,
  },
  isBanned: {
    type: Boolean,
  },
  Password: {
    type: String,
    required: true,
  },
  Uid: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
  },
  interests: {
    type: Array,
  },
  education_level: {
    type: String,
  },
  friends: {
    type: Array,
  },
});

const ACCcollection = mongoose.model('account', mySchema);

export default ACCcollection;
