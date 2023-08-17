import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

mongoose.pluralize(null);

export interface IUserSchema extends Document {
    id: number;
    username: string;
    email: string;
    password: string;
    privilege: string;
}

const userSchema: Schema = new mongoose.Schema({
    id: Number,
    username: String,
    email:{
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    privilege: {
        required: true,
        default: "base",
        type: String,
    }
})

export default mongoose.model("user", userSchema);