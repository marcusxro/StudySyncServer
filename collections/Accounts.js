import mongoose from 'mongoose';

const atlasUri = 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/StudySync';

mongoose.connect(atlasUri?.toString())
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
});


const ACCcollection = mongoose.model('account', mySchema);

export default ACCcollection;