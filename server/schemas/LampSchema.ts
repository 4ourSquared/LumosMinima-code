import mongoose, { Schema } from "mongoose";
mongoose.pluralize(null);

export interface ILampSchema extends Document{
    id: number;
    stato: string;
    lum: number;
    luogo: string;
    area: number;
    guasto: boolean;
    mode: string;
}

const lampioneSchema : Schema= new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    stato: String,
    lum: Number,
    luogo: String,
    area: {
        type: Number,
        required: true,
    },
    guasto: Boolean,
    mode: { type: String, default: "manuale" },
});

export default mongoose.model("lampioni", lampioneSchema);

