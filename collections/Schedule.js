import mongoose from 'mongoose';


mongoose.connect(process.env.ATLAS_URI || 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/StudySync')
  .then(() => {
    console.log("Connected to MongoDB Atlas (Schedule)");

  })
  .catch((e) => {
    console.error("Error connecting to MongoDB Atlas:", e);
  });


const mySchema = new mongoose.Schema({
  EventName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
  SelectedUser: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  Uid: {
    type: String,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  isAgreed: {
    type: Boolean,
    required: true,
  },
});

const Schedule = mongoose.model('Schedule', mySchema);

export default Schedule;
