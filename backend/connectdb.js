import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()

 export default async function Connectdb() {
    try {
        await mongoose.connect(process.env.MONGODBURL);
        console.log("Database Connected Sucessfully")
    } catch (error) {
        console.log(error);    
    }
}