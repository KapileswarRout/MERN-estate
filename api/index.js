import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
dotenv.config()

const app = express();
app.use(express.json()); //by default json cannot be send to server so this will allow it

mongoose.connect(process.env.MONGO).then( () => {
    console.log('Connected to mongodb')
})
.catch( (err)=>{
    console.log(err);
})



app.listen(3000, ()=>{
    console.log("server is running at port 3000!")
})

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)