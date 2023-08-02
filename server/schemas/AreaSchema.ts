import mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import lampioneSchema, { ILampSchema } from "./LampSchema";
import sensoreSchema, {ISensorSchema} from "./SensorSchema";

mongoose.pluralize(null);

export interface IAreaSchema extends Document {
    id: number;
    nome: string;
    descrizione: string;
    latitudine: string;
    longitudine: string;
    lampioni: ILampSchema[];
    sensori: ISensorSchema[];
}

const areaSchema : Schema<IAreaSchema> = new mongoose.Schema<IAreaSchema>({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    nome: String,
    descrizione: String,
    latitudine: String,
    longitudine: String,
    lampioni: [{ type: lampioneSchema.schema }],
    sensori: [{ type: sensoreSchema.schema }],
});

export default mongoose.model<IAreaSchema>("aree", areaSchema);
