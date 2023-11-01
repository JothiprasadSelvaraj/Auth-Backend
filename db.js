const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MongoDb_Url);
        console.log("Connected to MongoDB");
    } catch(error){
        console.log(error);
    }
}

module.exports = connectdb;