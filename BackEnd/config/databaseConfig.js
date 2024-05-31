const mongoose = require('mongoose');
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/talkbuddy';

mongoose.set('strictQuery', false);

const connectDatabase = async () => {
    try {
        await mongoose.connect(uri);
        console.log('> Database Connected...'.bgCyan);
    } catch (error) {
        console.log(`> Error while connecting to MongoDB: ${error.message}`.underline.red);
        process.exit(1);
    }
};

module.exports = connectDatabase;
