import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const productSchema = new Schema({
    market: {
        type: Schema.Types.ObjectId,
        ref: 'Market',
    },
    name: {
        type: String,
        required: true,
    },
    newPrice: {
        type: Number,
        // required: true,
    },
    oldPrice: {
        type: Number,
        // required: true,
    },
    discount: {
        type: Number,
    },
    imageUrl: String,
    link: String,
});

// productSchema.index({ name: 'text' });

const Product = model('Product', productSchema);
export default Product;
