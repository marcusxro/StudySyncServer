import mongoose from 'mongoose';


mongoose.connect(process.env.ATLAS_URI || 'mongodb+srv://marcussalopaso1:zedmain1525@cluster0.m8fd2iw.mongodb.net/StudySync')
    .then(() => {
        console.log("Connected to MongoDB Atlas (Activity)");

    })
    .catch((e) => {
        console.error("Error connecting to MongoDB Atlas:", e);
    });


const mySchema = new mongoose.Schema({
    Uid: {
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

});

const Acvitiy = mongoose.model('Activity', mySchema);

export default Acvitiy;
