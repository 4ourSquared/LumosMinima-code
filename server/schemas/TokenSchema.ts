import mongoose, {Schema} from "mongoose";
mongoose.pluralize(null);

export interface ITokenSchema extends Document{
    id: number;
    area: number;
    expiring: Date;
    used: boolean;
}

const tokenSchema : Schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    area: Number,
    expiring: Date,
    used: Boolean,
});

export default mongoose.model("token", tokenSchema);