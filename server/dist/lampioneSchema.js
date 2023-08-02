"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.pluralize(null);
const lampioneSchema = new mongoose_1.default.Schema({
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
    guasto: Boolean
});
exports.default = mongoose_1.default.model("lampioni", lampioneSchema);
