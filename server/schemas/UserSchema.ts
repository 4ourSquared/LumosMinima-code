import mongoose, { Schema, Document } from "mongoose";

mongoose.pluralize(null);

export interface IUserSchema extends Document {
    username: string;
    email: string;
    password: string;
    privilege: string;
}

const userSchema: Schema = new mongoose.Schema({
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
        default: "none",
        type: String,
    }
})

export default mongoose.model("user", userSchema);