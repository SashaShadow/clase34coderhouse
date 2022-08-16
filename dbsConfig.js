import mongoose from "mongoose";
import "dotenv/config.js";

//MONGODB CONFIG
export const db = mongoose.connect(process.env.MONGODB, 
{ useNewUrlParser: true })

const chatSchema = new mongoose.Schema({
    author: {type: Object, required: true },
    text: {type: String, required: true},
    time: {type: String, required: true}
}, {
    versionKey: false 
})

export const msgsModel = mongoose.model("Msgs", chatSchema);


const productSchema = new mongoose.Schema({
    name: {type: String, required: true, max: 25},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    photo: {type: String, required: true},
    code: {type: String, required: true, max: 10},
    desc: {type: String, required: true, max: 100},
})

export const productsModel = mongoose.model("Products", productSchema);


const userSchema = new mongoose.Schema({
    username: {type: String, required: true, max: 30},
    password: {type: String, required: true, max: 20},
    email: {type: String, required: true}
})

export const User = mongoose.model('Users', userSchema);
