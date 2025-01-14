import express from 'express';
import cors from 'cors';
import connectDb from './db/index.js';
import router from './routes/index.js'
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json()); 
app.use('/user',router);
connectDb()
.then(app.listen(PORT,()=>{
    console.log(`server is running at the port ${PORT} port`);
}))

