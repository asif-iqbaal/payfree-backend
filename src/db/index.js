import mongoose from 'mongoose';

const connectDb = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log("mongoDB connected"))
        .catch((err) => console.log("error to connect is ", err));

}

export default connectDb;