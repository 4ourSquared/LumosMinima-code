import mongoose, { Schema, Document } from "mongoose";
mongoose.pluralize(null);

export interface ISensorSchema extends Document{
    id: number;
    IP: string;
    luogo: string;
    raggio: number;
    area: number;
    sig_time: number;
}

const sensoreSchema : Schema= new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    
    IP: String,
    luogo: String,
    raggio: Number,
    area: {
        type: Number,
        required: true,
    },
    sig_time: Number,
});

export default mongoose.model("sensori", sensoreSchema);
