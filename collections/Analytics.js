import mongoose from 'mongoose';


mongoose.connect(process.env.ATLAS_URI || 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/StudySync')
  .then(() => {
    console.log("Connected to MongoDB Atlas (analytics)");

  })
  .catch((e) => {
    console.error("Error connecting to MongoDB Atlas:", e);
  });


const mySchema = new mongoose.Schema({
  Uid: {
    type: String,
    required: true,
  },
  Activity: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
});

const ACCcollection = mongoose.model('analytics', mySchema);

export default ACCcollection;
