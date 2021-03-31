import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const tagSchema = new Schema({
    tag: {
        type: String,
        required: true,
    },
});

const Tag = model('Tag', tagSchema);
export default Tag;
