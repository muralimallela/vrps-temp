// models/Counter.ts
import mongoose, { Schema } from "mongoose";

const CounterSchema = new Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
});

export default mongoose.models.Counter ||
    mongoose.model("Counter", CounterSchema);
