import mongoose from 'mongoose';


mongoose.connect(process.env.ATLAS_URI || 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/StudySync')
  .then(() => {
    console.log("Connected to MongoDB Atlas (reports)");

  })
  .catch((e) => {
    console.error("Error connecting to MongoDB Atlas:", e);
  });


const mySchema = new mongoose.Schema({
  Uid: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
   Message: {
    type: String,
  },
  Date: {
    type: String,
    required: true,
  },
  UidToReport: {
    type: String,
    required: true,
  },
});

const ReportsSchema = mongoose.model('report', mySchema);

export default ReportsSchema;
