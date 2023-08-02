import mongoose, { Schema, Document } from "mongoose";
mongoose.pluralize(null);

export interface ISensorSchema extends Document{
    id: number;
    iter: string;
    IP: string;
    luogo: string;
    raggio: number;
    area: number;
}

const sensoreSchema : Schema= new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    iter: { type: String, default: "manuale" },
    IP: String,
    luogo: String,
    raggio: Number,
    area: {
        type: Number,
        required: true,
    }
});

export default mongoose.model("sensori", sensoreSchema);
