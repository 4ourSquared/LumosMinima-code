"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const lampioneSchema_1 = __importDefault(require("./lampioneSchema"));
const sensoreSchema_1 = __importDefault(require("./sensoreSchema"));
mongoose_1.default.pluralize(null);
const areaSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    nome: String,
    descrizione: String,
    latitudine: String,
    longitudine: String,
    lampioni: [{ type: lampioneSchema_1.default.schema }],
    sensori: [{ type: sensoreSchema_1.default.schema }],
});
exports.default = mongoose_1.default.model("aree", areaSchema);
