import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const tagMarketSchema = new Schema({
    tagId: {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    },
    marketId: {
        type: Schema.Types.ObjectId,
        ref: 'Market',
    },
});

const TagMarket = model('TagMarket', tagMarketSchema);
export default TagMarket;
