import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const marketSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        default: '',
    },
});

const Market = model('Market', marketSchema);
export default Market;
