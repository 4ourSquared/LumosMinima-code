import mongoose, {Schema} from "mongoose";
mongoose.pluralize(null);

export interface ITokenSchema extends Document{
    id: number;
    area: number;
    expiring: Date;
}

const tokenSchema : Schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    area: Number,
    expiring: Date
});

export default mongoose.model("token", tokenSchema);