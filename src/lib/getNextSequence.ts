// lib/getNextSequence.ts

import Counter from "../models/Counter";

export async function getNextSequence(name: string) {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { value: 1 } },
        { new: true, upsert: true } // create if doesn't exist
    );

    return counter.value;
}
